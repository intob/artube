import { LitElement, css, html } from "lit"
import { buildDataUrl } from "../../util/gateway/data.js"

class ChannelTeaser extends LitElement {
  constructor() {
    super()
    this.posterUrl = ""
    this.avatarUrl = ""
  }

  static properties = {
    addr: { attribute: true },
    name: { attribute: true },
    description: { attribute: true },
    avatartxid: { attribute: true },
    avatarUrl: {}
  }

  static styles = css`
  x-card {
    display: flex;
    cursor: pointer;
    transition: background-color 300ms;
  }

  x-card:hover {
    background-color: var(--darken-color-2);
  }

  x-card:hover .avatar {
    filter: grayscale(.5);
  }

  .avatar {
    width: 200px;
    border-radius: 50%;
    object-fit: cover;
    transition: filter 300ms;
    margin: 20px;
  }

  .info {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  h2 {
    display: block;
    margin-top: 0;
  }

  @media(max-width:700px) {
    x-card {
      flex-direction: column;
    }

    .poster {
      width: 100%;
      border-radius: 10px 10px 0 0;
    }
  }
  `

  connectedCallback() {
    super.connectedCallback()
    this.avatarUrl = buildDataUrl(this.avatartxid)
  }

  render() {
    return html`
    <x-card @click=${() => window.location = `#/channel/${this.addr}`}>
      <img src=${this.avatarUrl} class="avatar"/>
      <div class="info">
        <h2>${this.name}</h2>
        <p>${this.description.slice(0, 200)}${this.description.length > 200 ? " ..." : ""}</p>
      </div>
    </x-card>
    `
  }
}
customElements.define("at-channel-teaser", ChannelTeaser)