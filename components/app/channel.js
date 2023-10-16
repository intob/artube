import { LitElement, css, html } from "lit"
import { map } from "lit/directives/map.js"
import { getVideos } from "../../util/query/video.js"
import { getChannelAvatarTxId, getChannelTxId } from "../../util/query/channel.js"
import { buildDataUrl, fetchData } from "../../util/gateway/data.js"
import { getWalletAddress } from "../../util/wallet.js"
import { shortenId } from "../../util/format.js"
import { Toast } from "../generic/toast.js"
import { Loader } from "../generic/loader.js"

class Channel extends LitElement {
  constructor() {
    super()
    this.avatarUrl = ""
    this.updatedChannel = {
      name: null,
      description: null
    }
  }

  static properties = {
    address: { attribute: true },
    channel: {},
    videos: {},
    avatarUrl: {},
    editMode: { type: Boolean }
  }

  static styles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  header {
    display: flex;
    gap: 40px;
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    justify-content: flex-start;
  }

  .details x-button {
    align-self: flex-end;
  }

  img {
    width: 250px;
    border-radius: 50%;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
  }

  @media(max-width: 600px) {
    header {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
  `

  async connectedCallback() {
    super.connectedCallback()
    this.channel = {
      name: `${shortenId(this.address)}'s Channel`
    }
    this.isOwn = this.address === await getWalletAddress()
    this.videos = await getVideos(this.address)
    const channelTxId = await getChannelTxId(this.address)
    if (channelTxId) {
      this.channel = await (await fetchData(channelTxId)).json()
      const avatarTxId = await getChannelAvatarTxId(this.address)
      this.avatarUrl = buildDataUrl(avatarTxId)
    }
  }

  render() {
    return html`
      <header>
        <img src=${this.avatarUrl} />
        <div class="details">
          ${this.isOwn && this.editMode ? this.renderEditMode() : this.renderDetails()}
        </div>
      </header>
      ${map(this.videos, v => this.renderTeaser(v))}
    `
  }

  renderDetails() {
    return html`
      <h1>${this.channel.name}</h1>
      <p>${this.channel.description}</p>
      <div class="buttons">
        <x-button ?hidden=${!this.isOwn} @click=${this.switchToEditMode}>Edit</x-button>
        <x-button ?hidden=${!this.isOwn} @click=${() => window.location = "#/upload"}>Upload</x-button>
      </div>
    `
  }

  renderEditMode() {
    return html`
      <h1>${this.channel.name}</h1>
      <text-input placeholder="Channel Name" @input=${this.handleNameChange} .value=${this.channel.name}></text-input>
      <text-input placeholder="Channel description" @input=${this.handleDescriptionChange} .value=${this.channel.description}></text-input>
      <x-button @click=${this.save}>Save</x-button>
    `
  }

  renderTeaser(v) {
    return html`
      <at-teaser videotxid=${v.id}></at-teaser>
    `
  }

  switchToEditMode() {
    this.updatedChannel = { ...this.channel }
    this.editMode = true
  }
  
  async save() {
    this.editMode = false
    if (!confirm("Are you sure you want to update your channel?")) {
      Toast.notify("Nothing changed")
      this.updatedChannel = { ...this.channel }
      return
    }
    let tx = await window.arweave.createTransaction({
      data: JSON.stringify(this.updatedChannel)
    })
    tx.addTag("Content-Type", "application/json")
    tx.addTag("App-Name", "artube")
    tx.addTag("Artube-Type", "channel")
    await window.arweave.transactions.sign(tx)
    for await (const uploader of window.arweave.transactions.upload(tx)) {
      Loader.setProgress(tx.id, uploader.pctComplete/100)
    }
    Toast.notify("Changes saved")
  }

  handleDescriptionChange(e) {
    this.updatedChannel.description = e.detail.value
  }

  handleNameChange(e) {
    this.updatedChannel.name = e.detail.value
  }
}
customElements.define("at-channel", Channel)