import { html, css, LitElement } from "lit"

class Textarea extends LitElement {

  static styles = css`
  textarea {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    font-size: 1em;
    font-family: sans-serif;
    background-color: var(--input-background-color);
    color: var(--input-font-color);
    transition: background-color 200ms;
    border: 1px solid var(--input-border-color);
    border-radius: 5px;
    max-width: 100%;
    min-width: 100%;
    min-height: 100px;
    resize: none;
  }
  
  textarea:hover:not(:focus) {
    border-color: var(--input-hover-border-color);
    color: var(--input-hover-font-color);
  }

  textarea:focus {
    color: var(--light-color-1);
  }
  `

  static properties = {
    placeholder: {},
    value: {}
  }

  constructor() {
    super()
  }

  render() {
    return html`
    <textarea @input=${this.handleInput} placeholder=${this.placeholder}>${this.value}</textarea>
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
}
customElements.define("x-textarea", Textarea)