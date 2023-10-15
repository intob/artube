import { LitElement, css, html } from "lit"
import { map } from "lit/directives/map.js"
import { getVideos } from "../../util/query/video.js"
import { getChannelAvatarTxId, getChannelTxId } from "../../util/query/channel.js"
import { buildDataUrl, fetchData } from "../../util/gateway/data.js"

class Channel extends LitElement {
  constructor() {
    super()
    this.avatarUrl = ""
  }

  async connectedCallback() {
    super.connectedCallback()
    this.videos = await getVideos(this.address)
    const channelTxId = await getChannelTxId(this.address)
    this.channel = await (await fetchData(channelTxId)).json()
    const avatarTxId = await getChannelAvatarTxId(this.address)
    this.avatarUrl = buildDataUrl(avatarTxId)
  }

  static properties = {
    address: { attribute: true },
    channel: {},
    videos: {},
    avatarUrl: {}
  }

  static styles = css`
  header {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  img {
    width: 250px;
    border-radius: 50%;
  }

  @media(max-width: 600px) {
    header {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
  `

  render() {
    return html`
      <header>
        <img src=${this.avatarUrl} />
        <div class="description">
        <h1>${this.channel?.name}</h1>
        <p>${this.channel?.description}</p>
        </div>
      </header>
      ${map(this.videos, v => this.renderTeaser(v))}
    `
  }

  renderTeaser(v) {
    return html`
      <at-teaser videotxid=${v.id}></at-teaser>
    `
  }

  
}
customElements.define("at-channel", Channel)