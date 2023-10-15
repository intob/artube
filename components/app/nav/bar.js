import { html, css, LitElement } from "lit"
import { renderIcon } from "../../../util/icon.js"
import { shortenId } from "../../../util/format.js"

class NavBar extends LitElement {

  static styles = [
    css`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
      z-index: 1;
      border-radius: 0 0 10px 10px;
    }

    .left, .right {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    x-link {
      padding: 10px 20px;
    }

    .home {
      font-weight: 600;
      font-size: 1.2em;
      padding-left: 0;
    }

    .home svg {
      height: 40px;
      width: 40px;
    }

    x-link svg {
      fill: var(--dimmed-font-color);
      transition: fill 300ms;
    }

    x-link:hover svg {
      fill: var(--body-font-color);
    }
    `
  ]

  static properties = {
    walletAddress: {}
  }
  
  constructor() {
    super()
    this.getWalletAddress()
  }

  async connectedCallback() {
    super.connectedCallback()
    this.getWalletAddress = this.getWalletAddress.bind(this)
    window.addEventListener("at-wallet-connected", this.getWalletAddress)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener("at-wallet-connected", this.getWalletAddress)
  }
  
  render() {
    return html`
    <div class="left">
      <x-link href="#/" class="home">
          ${renderIcon("play")}
          <span>ArTube</span>
      </x-link>
      <x-link href="#/">Home</x-link>
      <x-link href="#/channel/${this.walletAddress||""}" ?hidden=${!this.walletAddress}>My channel</x-link>
      <x-link href="#/create-video" ?hidden=${!this.walletAddress}>Create video</x-link>
      <!--<nav-dropdown>
        <span slot="parent">Dropdown</span>
        <x-link slot="child" href="#/tags/author">Author</x-link>
        <x-link slot="child" href="#/tags/beat">Beat</x-link>
      </nav-dropdown>-->
    </div>
    <div class="right">
      ${this.renderConnection()}
    </div>
    `
  }

  renderConnection() {
    if (!this.walletAddress) {
      return html`
      <x-link href="#/connect-wallet" class="connect">${renderIcon("wallet")} <span>Connect wallet</span></x-link>
      `
    }
    return html`
    <span>${shortenId(this.walletAddress)}</span>
    `
  }

  async getWalletAddress() {
    if (!window.arweaveWallet) {
      return
    }
    this.walletAddress = await window.arweaveWallet.getActiveAddress()
  }
}
customElements.define("nav-bar", NavBar, { extends: "nav" })