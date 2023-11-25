import { LitElement, css, html } from "lit"
import { map } from "lit/directives/map.js"
import { search } from "../../util/search.js"

class Search extends LitElement {
  constructor() {
    super()
    this.results = {}
  }

  static styles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  `

  static properties = {
    query: { attribute: true },
    results: {}
  }

  async connectedCallback() {
    super.connectedCallback()
    this.results = await search(this.query)
  }

  render() {
    return html`
    ${map(Object.keys(this.results), key => this.renderTeaser(key))}
    `
  }

  renderTeaser(key) {
    const item = this.results[key]
    console.log(item)
    if (item.entry.type === "video") {
      return html`
        <at-video-teaser videotxid=${key}
            postertxid=${item.entry.content.posterTxId}
            title=${item.entry.content.title}
            description=${item.entry.content.description}
        ></at-video-teaser>
      `
    }
    if (item.entry.type === "channel") {
      return html`
      <at-channel-teaser addr=${key}
        name=${item.entry.content.name}
        description=${item.entry.content.description}
        avatartxid=${item.entry.content.avatarTxId}
      ></at-channel-teaser>
      `
    }
  }
}
customElements.define("at-search", Search)