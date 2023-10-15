import { LitElement, html, css } from "lit"
import { styleMap } from "lit-html/directives/style-map.js"

const jobTimeout = 2000

export class Loader extends LitElement {

  static setProgress(job, progress) {
    document.dispatchEvent(new CustomEvent("swi-progress", {
      detail: { job, progress }
    } ))
  }

  static styles = [
    css`
    :host {
      display: flex;
      width: 100%;
    }

    .progress {
      height: 5px;
      background-color: var(--light-color-2);
      transition: width 300ms;
    }
    `
  ]

  static properties = {
    jobs: {},
    mean: {}
  }

  constructor() {
    super()
    this.jobs = {}
    this.mean = 0
  }

  connectedCallback() {
    super.connectedCallback()
    this.handleProgress = this.handleProgress.bind(this)
    document.addEventListener("swi-progress", this.handleProgress)
    setInterval(() => {
      const jobIds = Object.keys(this.jobs)
      for(const jobId of jobIds) {
        if (this.jobs[jobId].updatedAt < Date.now() - jobTimeout) {
          delete this.jobs[jobId]
          this.calculateMean()
        }
      }
    }, jobTimeout)
  }

  handleProgress(e) {
    if (e.detail.progress === 1) {
      delete this.jobs[e.detail.job]
    } else {
      this.jobs[e.detail.job] = {
        progress: e.detail.progress,
        updatedAt: Date.now()
      }
    }
    this.calculateMean()
  }

  calculateMean() {
    const arr = Object.keys(this.jobs)
    if (arr.length === 0) {
      this.mean = 1
    } else {
      const getProgress = job => this.jobs[job].progress
      this.mean = arr.reduce((a, c) => a + getProgress(c), 0) / arr.length
    }
    this.requestUpdate()
  }

  render() {
    const styles = { width: `${this.mean*100}%` }
    return html`
      <div class="progress" style=${styleMap(styles)}></div>
    `
  }
}
customElements.define("x-loader", Loader)