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
    color: var(--light-color-4);
  }

  slot[name="parent"]:hover {
    color: var(--light-color-2);;
  }

  div slot[name="child"] {
    display: none;
  }

  div:hover slot[name="child"] {
    display: flex;
  }

  @media(max-width:1300px) {
    slot[name="child"] {
      right: 20px;
    }
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