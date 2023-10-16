import { LitElement, css, html } from "lit"
import { map } from "lit/directives/map.js"
import { getVideos } from "../../util/query/video.js"
import { getChannelAvatarTxId, getChannelTxId } from "../../util/query/channel.js"
import { buildDataUrl, fetchData } from "../../util/gateway/data.js"
import { getWalletAddress } from "../../util/wallet.js"
import { fmtSize, shortenId } from "../../util/format.js"
import { Toast } from "../generic/toast.js"
import { Loader } from "../generic/loader.js"
import { readFileAsArrayBuffer } from "../../util/file.js"

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
    editMode: { type: Boolean },
    newAvatarFile: {}
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
    align-items: flex-start;
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

  .avatar-select {
    display: flex;
    align-items: center;
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
      <div class="avatar-select">
        <span>Poster image</span>
        <file-input @change=${e => this.newAvatarFile = e.detail.files[0]} accept="image/jpeg,image/png,image/webp"></file-input>
        <span ?hidden=${!this.newAvatarFile}>${this.newAvatarFile?.name}</span>
        <span ?hidden=${!this.newAvatarFile}>${fmtSize(this.newAvatarFile?.size)}</span>
      </div>
      <div class="buttons">
        <x-button @click=${this.cancel}>Cancel</x-button>
        <x-button @click=${this.save}>Save</x-button>
      </div>
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

  cancel() {
    this.editMode = false
    this.updatedChannel = { ...this.channel }
    Toast.notify("Nothing changed")
  }
  
  async save() {
    this.editMode = false
    if (!confirm("Are you sure that you want to update your channel?")) {
      Toast.notify("Nothing changed")
      this.updatedChannel = { ...this.channel }
      return
    }
    await this.uploadChannelJson()
    await this.uploadNewAvatar()
  }

  async uploadChannelJson() {
    if (this.channel.name === this.updatedChannel.name &&
      this.channel.description === this.updatedChannel.description) {
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

  async uploadNewAvatar() {
    if (!this.newAvatarFile) {
      return
    }
    const buf = await readFileAsArrayBuffer(this.newAvatarFile)
    let tx = await window.arweave.createTransaction({
      data: buf
    })
    tx.addTag("Content-Type", this.newAvatarFile.type)
    tx.addTag("App-Name", "artube")
    tx.addTag("Artube-Type", "avatar")
    await window.arweave.transactions.sign(tx)
    for await (const uploader of window.arweave.transactions.upload(tx)) {
      Loader.setProgress(tx.id, uploader.pctComplete/100)
    }
    Toast.notify("Uploaded avatar")
    this.newAvatarFile = null
  }

  handleDescriptionChange(e) {
    this.updatedChannel.description = e.detail.value
  }

  handleNameChange(e) {
    this.updatedChannel.name = e.detail.value
  }
}
customElements.define("at-channel", Channel)