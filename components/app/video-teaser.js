import { LitElement, css, html } from "lit"
import { buildDataUrl } from "../../util/gateway/data.js"

class VideoTeaser extends LitElement {
  constructor() {
    super()
    this.posterUrl = ""
    this.avatarUrl = ""
  }

  static properties = {
    videotxid: { attribute: true },
    title: { attribute: true },
    description: { attribute: true },
    postertxid: { attribute: true },
    posterUrl: {}
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

  x-card:hover .poster {
    filter: grayscale(.5);
  }

  .poster {
    width: 50%;
    min-width: 50%;
    border-radius: 10px 0 0 10px;
    object-fit: cover;
    transition: filter 300ms;
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

  .channel {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .avatar {
    width: 60px;
    border-radius: 50%;
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
    this.posterUrl = buildDataUrl(this.postertxid)
  }

  render() {
    return html`
    <x-card @click=${() => window.location = `#/watch/${this.videotxid}`}>
      <img src=${this.posterUrl} class="poster"/>
      <div class="info">
        <h2>${this.title}</h2>
        <p>${this.description.slice(0, 200)}${this.description.length > 200 ? " ..." : ""}</p>
        <div class="channel">
          <img src=${this.avatarUrl} class="avatar"/>
          <span ?hidden=${!this.channel}>${this.channel?.name}</span>
        </div>
      </div>
    </x-card>
    `
  }
}
customElements.define("at-video-teaser", VideoTeaser)