import { html, css, LitElement } from "lit"

export class Button extends LitElement {
  static get styles() {
    return [
      css`
      button {
        border: 2px solid var(--accent-light-color-1);
        border-radius: 5px;
        background: var(--background-gradient);
        cursor: pointer;
        color: var(--light-color-2);
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        padding: 8px 10px;
        min-height: 44px;
        min-width: 84px;
        transition-duration: 300ms;
        transition-property: border-color background-color;
        user-select: none;
        gap: 5px;
      }

      button:hover:not([disabled]) {
        background-color: var(--signal-color-1);
        border-color: var(--signal-color-2);
      }

      button[disabled] {
        color: var(--disabled-font-color);
      }
      `
    ]
  }

  static get properties() {
    return {
      disabled: { type: Boolean, attribute: true }
    }
  }

  constructor() {
    super()
  }

  render() {
    return html`
    <button ?disabled=${this.disabled}><slot></slot></button>
    `
  }
}
customElements.define("x-button", Button)