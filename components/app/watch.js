import { LitElement, css, html } from "lit"
import { getVideoMetadataTx, getVideoPosterTxId } from "../../util/query/video.js"
import { buildDataUrl, fetchData } from "../../util/gateway/data.js"
import { getChannelAvatarTxId, getChannelTxId } from "../../util/query/channel.js"

class Watch extends LitElement {
  constructor() {
    super()
    this.posterUrl = ""
    this.videoUrl = ""
    this.avatarUrl = ""
    this.channelAddress = ""
  }

  static properties = {
    videotxid: { attribute: true },
    metadata: {},
    posterUrl: {},
    videoUrl: {},
    channel: {},
    avatarUrl: {},
    address: {}
  }

  static styles = css`
  video {
    width: 100%;
  }

  img {
    width: 80px;
    border-radius: 50%;
  }

  .channel {
    padding: 20px;
    display: flex;
    gap: 20px;
    align-items: center;
    cursor: pointer;
    transition: background-color 300ms;
  }

  .channel:hover {
    background-color: var(--darken-color-2);
  }
  `

  async connectedCallback() {
    super.connectedCallback()
    this.videoUrl = buildDataUrl(this.videotxid)
    const posterTxId = await getVideoPosterTxId(this.videotxid)
    this.posterUrl = buildDataUrl(posterTxId)
    const metadataTx = await getVideoMetadataTx(this.videotxid)
    this.metadata = await (await fetchData(metadataTx.id)).json()
    this.address = metadataTx.owner.address
    const channelTxId = await getChannelTxId(this.address)
    this.channel = await (await fetchData(channelTxId)).json()
    const avatarTxId = await getChannelAvatarTxId(this.address)
    this.avatarUrl = buildDataUrl(avatarTxId)
  }

  render() {
    return html`
      <video src=${this.videoUrl}
          poster=${this.posterUrl}
          controls
      ></video>
      <header>
        <h1>${this.metadata?.title}</h1>
        <p>${this.metadata?.description}</p>
      </header>
      <x-card class="channel" @click=${() => window.location = `#/channel/${this.address}`}>
        <img src=${this.avatarUrl} />
        <span>${this.channel?.name}</span>
      </x-card>
    `
  }
}
customElements.define("at-watch", Watch)