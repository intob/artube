import { html, css, LitElement } from "lit"

class FileInput extends LitElement {

  static styles = css`
  input {
    display: none;
  }
  `

  static properties = {
    accept: { attribute: true },
    multiple: { attribute: true, type: Boolean },
    disabled: { attribute: true, type: Boolean },
    icon: { attribute: true }
  }

  constructor() {
    super()
  }

  render() {
    return html`
    <input type="file" @change=${this.handleChange} accept=${this.accept} ?multiple=${this.multiple} />
    <icon-button icon=${this.icon} @click=${this.openFinder} ?disabled=${this.disabled}>Select file</icon-button>
    `
  }

  handleChange(e) {
    this.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      composed: true,
      detail: {
        files: e.target.files
      }
    }))
    e.target.value = ""
  }

  openFinder() {
    this.fileInput.click()
  }

  get fileInput() {
    return this.renderRoot.querySelector("input")
  }
}
customElements.define("file-input", FileInput)