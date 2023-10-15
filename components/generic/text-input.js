import { html, css, LitElement } from "lit"

class TextInput extends LitElement {

  static styles = css`
  input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    font-size: 1em;
    background-color: var(--input-background-color);
    color: var(--input-font-color);
    transition: background-color 200ms;
    border: 1px solid var(--input-border-color);
    border-radius: 5px;
  }

  input::placeholder {
    color: var(--input-font-color);
  }
  
  input:hover:not(:focus) {
    border-color: var(--input-hover-border-color);
    color: var(--input-hover-font-color);
  }

  input:focus {
    outline: none;
    border-color: var(--input-focus-border-color);
    color: var(--light-color-1);
  }
`

  static properties = {
    type: {},
    placeholder: {},
    value: { attribute: true },
    required: {},
    autofocus: {}
  }

  constructor() {
    super()
  }

  async attributeChangedCallback(name, _old, value) {
    super.attributeChangedCallback(name, _old, value)
    if (name === "value" && this.inputElement) {
      this.inputElement.value = value
    }
  }

  render() {
    return html`
    <input @input=${this.handleInput}
        type="${this.type}"
        placeholder="${this.placeholder}"
        autocomplete="off"
        value=${this.value}
        ?required=${this.required}
        ?autofocus=${this.autofocus}
    />
    `
  }

  handleInput(e) {
    e.stopPropagation()
    this.value = e.target.value
    this.dispatchEvent(new CustomEvent("input", {
      bubbles: false,
      detail: {
        value: e.target.value
      }
    }))
  }

  get inputElement() {
    return this.renderRoot?.querySelector("input")
  }
}
customElements.define("text-input", TextInput)