import { LitElement, css, html } from "lit"
import {
  getVideoMetadataTxId,
  getVideoPosterTxId,
  getVideoTx
} from "../../util/query/video.js"
import { buildDataUrl, fetchData } from "../../util/gateway/data.js"
import { getChannelAvatarTxId, getChannelTxId } from "../../util/query/channel.js"

class Watch extends LitElement {
  constructor() {
    super()
    this.posterUrl = ""
    this.videoUrl = ""
    this.avatarUrl = ""
    this.address = ""
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
    const videoTx = await getVideoTx(this.videotxid)
    this.address = videoTx.owner.address
    const posterTxId = await getVideoPosterTxId(this.address, this.videotxid)
    this.posterUrl = buildDataUrl(posterTxId)
    const metadataTxId = await getVideoMetadataTxId(this.address, this.videotxid)
    this.metadata = await (await fetchData(metadataTxId)).json()
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