import { LitElement, html, css } from "lit"
import { fmtSize } from "../../util/format.js"
import { Toast } from "../generic/toast.js"
import { readFileAsArrayBuffer } from "../../util/file.js"

class CreateVideo extends LitElement {
  static styles = css`
  x-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  `

  static properties = {
    file: {},
  }

  constructor() {
    super()
  }
  
  render() {
    return html`
    <h1>Create video</h1>
    <x-card>
      <text-input placeholder="Name" @input=${e => this.videoName = e.detail.value}></text-input>
      <x-textarea placeholder="Description" @input=${e => this.videoDesc = e.detail.value}></x-textarea>
    </x-card>
    ${this.renderFileSelect()}
    <icon-button icon="upload" @click=${this.handleUpload}>Upload</icon-button>
    `
  }

  renderFileSelect() {
    return html`
    <x-card>
      ${this.renderFilePreview()}
      <file-input icon="video-file" accept="video/mp4" @change=${this.handleFileChange}></file-input>
    </x-card>
    `
  }

  renderFilePreview() {
    if (!this.file) {
      return
    }
    return html`
      <span>${this.file.name}</span>
      <span>${fmtSize(this.file.size)}</span>
    `
  }

  handleFileChange(e) {
    this.file = e.detail.files[0]
  }

  async handleUpload() {
    const buf = await readFileAsArrayBuffer(this.file)

    // generate wallet
    const key = await window.arweave.wallets.generate()
    const addr = await window.arweave.wallets.jwkToAddress(key)
    await window.arweave.api.get(`mint/${addr}/100000000000000000000000`)
    await window.arweave.api.get("mine")
  
    // create tx
    let tran = await window.arweave.createTransaction({
      data: buf
    })
    tran.addTag("Content-Type", "video/mp4")
    await window.arweave.transactions.sign(tran, key)

    let uploader = await window.arweave.transactions.getUploader(tran)

    while (!uploader.isComplete) {
      console.log(uploader.pctComplete)
      await uploader.uploadChunk()
    }

    Toast.notify("Uploaded")
  }
}
customElements.define("at-create-video", CreateVideo)