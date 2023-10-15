import { LitElement, html, css } from "lit"
import { map } from "lit/directives/map.js"

const defaultTimeout = 3000
const cleanupPeriod = 1000

export class Toast extends LitElement {

  /**
   * @param {String} title 
   * @param {{ msg, linkUrl, linkLabel }} options
   */
  static notify(title, options) {
    window.dispatchEvent(new CustomEvent("swi-notify", {
      detail: { title, ...options }
    } ))
  }

  static styles = [
    css`
    :host {
      display: flex;
      width: 100%;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      user-select: none;
    }

    .notification {
      padding: 10px;
      background-color: var(--darken-color-2);
      border-radius: 20px;
      margin: 5px 0;
      min-width: 200px;
      display: flex;
      flex-direction: column;
    }

    .title {
      font-weight: 600;
      margin: 5px 0;
    }

    .msg {
      margin: 5px 0;
    }

    a {
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
      transition-duration: 300ms;
      transition-property: border-color background-color;
      user-select: none;
      text-decoration: none;
    }

    a:hover {
      background-color: var(--signal-color-1);
      color: var(--light-color-2);
    }
    `
  ]

  static properties = {
    notifications: {}
  }

  constructor() {
    super()
    this.notifications = []
  }

  connectedCallback() {
    super.connectedCallback()
    this.handleNotification = this.handleNotification.bind(this)
    window.addEventListener("swi-notify", this.handleNotification)
    this.removeExpiredNotifications = this.removeExpiredNotifications.bind(this)
    setInterval(this.removeExpiredNotifications, cleanupPeriod)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener("swi-notify", this.handleNotification)
  }

  handleNotification(e) {
    this.notifications.push({
      ...e.detail,
      expires: Date.now()+(e.detail.timeout||defaultTimeout)
    })
    this.requestUpdate()
  }

  removeExpiredNotifications() {
    this.notifications = this.notifications.filter(n => n.expires > Date.now())
    this.requestUpdate()
  }

  render() {
    return html`
      ${map(this.notifications, n => this.renderNotification(n))}
    `
  }

  renderNotification(n) {
    return html`
      <div class="notification">
        ${this.renderTitle(n.title)}
        ${this.renderMsg(n.msg)}
        ${this.renderLink(n.linkUrl, n.linkLabel)}
      </div>
    `
  }

  renderTitle(title) {
    if (!title) {
      return
    }
    return html`
      <div class="title">${title}</div>
    `
  }

  renderMsg(msg) {
    if (!msg) {
      return
    }
    return html`
      <div class="msg">${msg}</div>
    `
  }

  renderLink(url, label) {
    if (!url || !label) {
      return
    }
    return html`
      <a href=${url} target="_blank">${label}</a>
    `
  }
}
customElements.define("x-toast", Toast)