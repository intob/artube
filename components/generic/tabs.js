import { LitElement, html, css } from "lit"

class Tabs extends LitElement {
  static styles = css`
    nav {
      display: flex;
    }

    nav > ::slotted([slot="tab"]) {
      border: 2px solid transparent;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      color: var(--tab-font-color);
      cursor: pointer;
      flex: 1 1 auto;
      margin-bottom: -2px;
      padding: 1em 2em;
      text-align: center;
    }

    nav > ::slotted([slot="tab"]:hover) {
      background-color: var(--tab-hover-background-color);
      color: var(--tab-hover-font-color);
      transition: all 200ms linear;
    }

    nav > ::slotted([slot="tab"][selected]) {
      background-color: var(--tab-hover-background-color);
      border-bottom-color: transparent;
      transition: all 200ms ease;
    }

    nav > ::slotted([slot="tab"]) {
      border-bottom-color: var(--panel-border-color);
    }

    ::slotted([slot="panel"]) {
      background-color: var(--panel-background-color);
      display: none;
      justify-content: center;
      min-height: 300px;
      padding: 20px;
      align-items: center;
      justify-content: center;
      border-radius: 0 0 10px 10px;
    }

    ::slotted([slot="panel"][selected]) {
      display: flex;
    }
  `

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
  }

  selectTab(tabIndex) {
    this.tabs.forEach(tab => tab.removeAttribute("selected"))
    this.tabs[tabIndex].setAttribute("selected", "")
    this.panels.forEach(panel => panel.removeAttribute("selected"))
    this.panels[tabIndex].setAttribute("selected", "")
  }

  handleSelect(e) {
    const index = this.tabs.indexOf(e.target)
    this.selectTab(index)
  }

  render() {
    return html`
      <nav>
        <slot name="tab" role="button" @click=${e => this.handleSelect(e)}></slot>
      </nav>
      <slot name="panel"></slot>
    `
  }

  get tabs() {
    return Array.from(this.querySelectorAll("[slot=tab]"))
  }

  get panels() {
    return Array.from(this.querySelectorAll("[slot=panel]"))
  }
}
customElements.define("x-tabs", Tabs)