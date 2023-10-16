import { html, css, LitElement } from "lit"
import { renderIcon } from "../../../util/icon.js"
import { shortenId } from "../../../util/format.js"
import { getWalletAddress } from "../../../util/wallet.js"

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
      fill: var(--light-color-4);
      transition: fill 300ms;
    }

    x-link:hover svg {
      fill: var(--light-color-2);
    }
    `
  ]

  static properties = {
    walletAddress: {}
  }
  
  constructor() {
    super()
    this.setWalletAddress()
  }

  async connectedCallback() {
    super.connectedCallback()
    this.setWalletAddress = this.setWalletAddress.bind(this)
    window.addEventListener("at-wallet-connected", this.setWalletAddress)
    this.clearWalletAddress = this.clearWalletAddress.bind(this)
    window.addEventListener("at-wallet-disconnected", this.clearWalletAddress)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener("at-wallet-connected", this.setWalletAddress)
    window.removeEventListener("at-wallet-disconnected", this.clearWalletAddress)
  }
  
  render() {
    return html`
    <div class="left">
      <x-link href="#/" class="home">
          ${renderIcon("play")}
          <span>ArTube</span>
      </x-link>
      <x-link href="#/">Home</x-link>
      <x-link href="#/what">ar what?</x-link>
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
    <nav-dropdown>
      <span slot="parent">${shortenId(this.walletAddress)}</span>
      <x-link slot="child" href="#/channel/${this.walletAddress||""}" ?hidden=${!this.walletAddress}>Your channel</x-link>
      <x-link slot="child" href="#/upload" ?hidden=${!this.walletAddress}>Upload</x-link>
      <x-link slot="child" href="#/disconnect-wallet">Disconnect</x-link>
    </nav-dropdown>
    `
  }

  async setWalletAddress() {
    this.walletAddress = await getWalletAddress()
  }

  clearWalletAddress() {
    this.walletAddress = null
  }
}
customElements.define("nav-bar", NavBar, { extends: "nav" })