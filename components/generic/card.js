import { html, css, LitElement } from "lit"

class Card extends LitElement {
  static styles = css`
  :host {
    display: block;
    background-color: var(--lighten-color-1);
    color: var(--light-color-2);
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