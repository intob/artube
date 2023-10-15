import { html, css } from "lit"
import { renderIcon } from "../../util/icon.js"
import { Button } from "./button.js"

class IconButton extends Button {
  static styles = [
    ...super.styles,
    css`
    button svg {
      fill: var(--button-font-color);
    }

    button:hover svg {
      fill: var(--button-hover-font-color);
    }

    button[disabled] svg, button[disabled]:hover svg {
      fill: var(--disabled-font-color);
    }
    ` 
  ]

  static get properties() {
    return Object.assign({
      icon: { attribute: true }
    }, super.properties)
  }

  constructor() {
    super()
  }

  render() {
    return html`
    <button ?disabled=${this.disabled}>${renderIcon(this.icon)}<slot></slot></button>
    `
  }
}
customElements.define("icon-button", IconButton)