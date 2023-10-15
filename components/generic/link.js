import { html, css, LitElement } from "lit"

class Link extends LitElement {

  static styles = css`
  :host {
    box-sizing: border-box;
    color: inherit;
  }

  a {
    text-decoration: none;
    transition: color 200ms;
    color: var(--light-color-4);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  a:hover {
    color: var(--light-color-2);
  }
  `

  static properties = {
    href: {}
  }

  constructor() {
    super()
  }

  render() {
    return html`
    <a href="${this.href}">
      <slot></slot>
    </a>
    `
  }
}
customElements.define("x-link", Link)