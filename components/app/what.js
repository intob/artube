import { LitElement, css, html } from "lit"

class What extends LitElement {
  constructor() {
    super()
  }

  static styles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  x-card {
    padding: 40px;
  }
  `

  render() {
    return html`
    <h1>What?!</h1>
    <x-card>
      <h2>Meet Arweave:<br>Permanent information storage.</h2>
      <p>The Arweave network is like Bitcoin, but for data: A permanent and decentralized web inside an open ledger.</p>
      <p>Permanent storage has many applications: from the preservation of humanity's most important data, to the hosting of truly decentralized and provably neutral web apps.</p>
      <p>The Arweave protocol is stable, mature and widely adopted. As such, its ecosystem is fully decentralized.</p>
    </x-card>
    <x-card>
      <h2>So what is ArTube?</h2>
      <p>Using this webapp, anyone can upload videos & associated content onto the Arweave network.</p>
      <p>Your personal channel is secured by your wallet.</p>
      <p>The result of an upload is a permanently stored video file, an associated metadata file, and a poster image.</p>
      <p>Noone can change the data, remove it, or censor it. You can access it using any webapp or any gateway.</p>
    </x-card>
    <x-card>
      <h2>This project started on 2023-10-14</h2>
      <p>I've only just begun...</p>
      <p>Tell me what you think on <x-link href="https://iris.to/joeyinnes">Nostr</x-link>.</p>
    </x-card>
    <x-card>
      <h2>Contribute</h2>
      <p><x-link href="https://github.com/intob/artube">ArTube on GitHub</x-link></p>
      <p><x-link href="https://joeyinnes.com">Made with 🤍 by Joey Innes</x-link></p>
    </x-card>
    `
  }
}
customElements.define("at-what", What)