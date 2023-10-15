import { html, css, LitElement } from "lit"

class Card extends LitElement {
  static styles = css`
  :host {
    display: block;
    background-color: var(--card-background-color);
    color: var(--card-font-color);
    box-sizing: border-box;
    border-radius: 10px;
    width: 100%;
  }
  `

  constructor() {
    super()
  }

  render() {
    return html`
    <slot></slot>
    `
  }
}
customElements.define("x-card", Card)