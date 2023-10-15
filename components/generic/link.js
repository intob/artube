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
    color: var(--dimmed-font-color);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  a:hover {
    color: var(--body-font-color);
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