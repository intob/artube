import { LitElement, css, html } from "lit"
import { map } from "lit/directives/map.js"
import { getVideos } from "../../util/query/video.js"

class Browse extends LitElement {
  constructor() {
    super()
  }

  static styles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  `

  static properties = {
    videos: {}
  }

  async connectedCallback() {
    super.connectedCallback()
    this.videos = await getVideos()
  }

  render() {
    return html`
    <h1>Browse</h1>
    ${map(this.videos, v => this.renderTeaser(v))}
    `
  }

  renderTeaser(v) {
    return html`
      <at-teaser videotxid=${v.id} channeladdress=${v.owner.address}></at-teaser>
    `
  }
}
customElements.define("at-browse", Browse)