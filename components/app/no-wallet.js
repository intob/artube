import { LitElement, css, html } from "lit"

class NoWallet extends LitElement {
  constructor() {
    super()
  }

  static styles = css`
  x-card {
    padding: 40px;
  }
  `

  render() {
    return html`
    <x-card>
      <h1>You need an Arweave wallet</h1>
      <p>To upload videos to your channel, you need a wallet. Your wallet has an address, this is your channel identifier.</p>
      <p>ArConnect is a browser extension wallet.</p>
      <x-link href="https://www.arconnect.io/download">Download ArConnect</x-link>
    </x-card>
    `
  }
}
customElements.define("at-no-wallet", NoWallet)