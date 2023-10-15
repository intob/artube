import { LitElement, html } from "lit"
import { map } from "lit/directives/map.js"
import { getVideos } from "../../util/query/video.js"

class Browse extends LitElement {
  constructor() {
    super()
  }

  static properties = {
    videos: {}
  }

  async connectedCallback() {
    super.connectedCallback()
    this.videos = await getVideos()
    console.log(this.videos)
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