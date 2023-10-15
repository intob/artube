import { html, css, LitElement } from "lit"

class NavDropdown extends LitElement {
  static styles = css`

  slot[name="child"] {
    flex-direction: column;
    position: absolute;
    background-color: var(--darken-color-3);
    padding: 10px 20px;
    border-radius: 10px;
  }

  slot[name="parent"] {
    display: block;
    padding: 10px 20px;
    color: var(--dimmed-font-color);
  }

  slot[name="parent"]:hover {
    color: var(--body-font-color);;
  }

  div slot[name="child"] {
    display: none;
  }

  div:hover slot[name="child"] {
    display: flex;
  }
  `

  constructor() {
    super()
  }

  render() {
    return html`
    <div>
      <slot name="parent"></slot>
      <slot name="child"></slot>
    </div>
    `
  }
}
customElements.define("nav-dropdown", NavDropdown)