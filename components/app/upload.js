import { LitElement, html, css } from "lit"
import { fmtSize } from "../../util/format.js"
import { Toast } from "../generic/toast.js"
import { readFileAsArrayBuffer } from "../../util/file.js"
import { Loader } from "../generic/loader.js"
import { getPrice } from "../../util/gateway/price.js"

class Upload extends LitElement {
  static styles = css`
  :host {
    display: flex;
    gap: 20px;
  }

  x-card {
    padding: 20px;
    display: flex;
    gap: 10px;
  }

  .confirm {
    flex-direction: column;
    min-width: 250px;
  }

  .uploader {
    flex-direction: column;
    min-width: 500px;
  }

  .metadata {
    flex-direction: column;
  }

  .file {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .upload {
    align-self: end;
  }

  @media(max-width:700px) {
    :host {
      flex-wrap: wrap;
    }
  }
  `

  static properties = {
    videoFile: {},
    posterFile: {},
    metadata: {},
    totalSize: {},
    price: {}
  }

  constructor() {
    super()
    this.metadata = {
      title: "",
      description: ""
    }
    this.price = 0
    this.totalSize = 0
  }
  
  render() {
    return html`
    ${this.renderUploader()}
    ${this.renderPrice()}
    `
  }

  renderUploader() {
    return html`
    <x-card class="uploader">
      <h1>Upload</h1>
      ${this.renderVideoFileSelect()}
      <x-card class="metadata">
        <h2>Metadata</h2>
        <text-input placeholder="Name" @input=${e => this.metadata.title = e.detail.value}></text-input>
        <x-textarea placeholder="Description" @input=${e => this.metadata.description = e.detail.value}></x-textarea>
      </x-card>
      ${this.renderPosterFileSelect()}
    </x-card>
    `
  }

  renderPrice() {
    return html`
    <div>
      <x-card class="confirm">
        <h2>${fmtSize(this.totalSize)}</h2>
        <h2>${this.price} AR</h2>
        <icon-button icon="upload" @click=${this.handleUpload} class="upload">Upload</icon-button>
      </x-card>
    </div>
    `
  }

  renderVideoFileSelect() {
    return html`
    <x-card class="file">
      <h2>Video file</h2>
      <file-input icon="video-file" accept="video/mp4" @change=${this.handleVideoFileChange}></file-input>
      ${this.renderVideoFilePreview()}
    </x-card>
    `
  }

  renderVideoFilePreview() {
    if (!this.videoFile) {
      return
    }
    return html`
      <span>${this.videoFile.name}</span>
      <span>${fmtSize(this.videoFile.size)}</span>
    `
  }

  renderPosterFileSelect() {
    return html`
    <x-card class="file">
      <h2>Poster image</h2>
      <file-input icon="image" accept="image/jpg,image/png,image/webp" @change=${this.handlePosterFileChange}></file-input>
      ${this.renderPosterFilePreview()}
    </x-card>
    `
  }

  renderPosterFilePreview() {
    if (!this.posterFile) {
      return
    }
    return html`
      <span>${this.posterFile.name}</span>
      <span>${fmtSize(this.posterFile.size)}</span>
    `
  }

  async handleVideoFileChange(e) {
    this.videoFile = e.detail.files[0]
    this.totalSize = this.videoFile.size + (this.posterFile?.size||0)
    this.price = await getPrice(this.totalSize)
  }

  async handlePosterFileChange(e) {
    this.posterFile = e.detail.files[0]
    this.totalSize = (this.videoFile?.size||0) + this.posterFile.size
    this.price = await getPrice(this.totalSize)
  }

  async handleUpload() {
    if (!confirm("Are you sure that you want to upload this video?")) {
      Toast.notify("Nothing happened")
      return
    }
    const videoTxId = await this.uploadVideo()
    await this.uploadMetadata(videoTxId)
    await this.uploadPoster(videoTxId)
    Toast.notify("Done")
  }

  async uploadVideo() {
    const buf = await readFileAsArrayBuffer(this.videoFile)
    let tx = await window.arweave.createTransaction({
      data: buf
    })
    tx.addTag("Content-Type", this.videoFile.type)
    tx.addTag("App-Name", "artube")
    tx.addTag("Artube-Type", "video")
    await window.arweave.transactions.sign(tx)
    for await (const uploader of window.arweave.transactions.upload(tx)) {
      Loader.setProgress(tx.id, uploader.pctComplete/100)
    }
    Toast.notify("Uploaded video")
    return tx.id
  }

  async uploadMetadata(videoTxId) {
    let tx = await window.arweave.createTransaction({
      data: JSON.stringify(this.metadata)
    })
    tx.addTag("Content-Type", "application/json")
    tx.addTag("App-Name", "artube")
    tx.addTag("Artube-Type", "metadata")
    tx.addTag("Artube-Video", videoTxId)
    await window.arweave.transactions.sign(tx)
    for await (const uploader of window.arweave.transactions.upload(tx)) {
      Loader.setProgress(tx.id, uploader.pctComplete/100)
    }
    Toast.notify("Uploaded metadata")
  }

  async uploadPoster(videoTxId) {
    const buf = await readFileAsArrayBuffer(this.posterFile)
    let tx = await window.arweave.createTransaction({
      data: buf
    })
    tx.addTag("Content-Type", this.posterFile.type)
    tx.addTag("App-Name", "artube")
    tx.addTag("Artube-Type", "poster")
    tx.addTag("Artube-Video", videoTxId)
    await window.arweave.transactions.sign(tx)
    for await (const uploader of window.arweave.transactions.upload(tx)) {
      Loader.setProgress(tx.id, uploader.pctComplete/100)
    }
    Toast.notify("Uploaded video")
  }
}
customElements.define("at-upload", Upload)