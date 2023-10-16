import { LitElement, css, html } from "lit"
import { getChannelAvatarTxId, getChannelTxId } from "../../util/query/channel.js"
import { getVideoMetadataTx, getVideoPosterTxId } from "../../util/query/video.js"
import { buildDataUrl, fetchData } from "../../util/gateway/data.js"

class Teaser extends LitElement {
  constructor() {
    super()
    this.posterUrl = ""
    this.avatarUrl = ""
  }

  static properties = {
    videotxid: { attribute: true },
    metadata: {},
    posterUrl: {},
    channeladdress: { attribute: true },
    channel: {},
    avatarUrl: {}
  }

  static styles = css`
  x-card {
    display: flex;
    cursor: pointer;
    transition: background-color 300ms;
  }

  x-card:hover {
    background-color: var(--darken-color-2);
  }

  x-card:hover .poster {
    filter: grayscale(.5);
  }

  .poster {
    width: 50%;
    min-width: 50%;
    border-radius: 10px 0 0 10px;
    object-fit: cover;
    transition: filter 300ms;
  }

  .info {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  h2 {
    display: block;
    margin-top: 0;
  }

  .channel {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .avatar {
    width: 60px;
    border-radius: 50%;
  }

  @media(max-width:700px) {
    x-card {
      flex-direction: column;
    }

    .poster {
      width: 100%;
      border-radius: 10px 10px 0 0;
    }
  }
  `

  async connectedCallback() {
    super.connectedCallback()
    const metadataTx = await getVideoMetadataTx(this.videotxid)
    if (!metadataTx) {
      return
    }
    this.metadata = await (await fetchData(metadataTx.id)).json()
    const posterTxId = await getVideoPosterTxId(this.videotxid)
    if (posterTxId) {
      this.posterUrl = buildDataUrl(posterTxId)
    }
    if (this.channeladdress) {
      this.channel = await this.getChannel()
      const avatarTxId = await getChannelAvatarTxId(metadataTx.owner.address)
      if (avatarTxId) {
        this.avatarUrl = buildDataUrl(avatarTxId)
      }
    }
  }

  render() {
    if (!this.metadata || this.posterUrl === "") {
      return
    }
    return html`
    <x-card @click=${() => window.location = `#/watch/${this.videotxid}`}>
      <img src=${this.posterUrl} class="poster"/>
      <div class="info">
        <h2>${this.metadata?.title}</h2>
        <p>${this.metadata?.description.slice(0, 200)}${this.metadata?.description.length > 200 ? " ..." : ""}</p>
        <div class="channel">
          <img src=${this.avatarUrl} class="avatar"/>
          <span ?hidden=${!this.channel}>${this.channel?.name}</span>
        </div>
      </div>
    </x-card>
    `
  }

  async getChannel() {
    const channelTxId = await getChannelTxId(this.channeladdress)
    if (!channelTxId) {
      console.log("no channel found")
      return
    }
    return (await fetchData(channelTxId)).json()
  }
}
customElements.define("at-teaser", Teaser)