import { unsafeHTML } from "lit/directives/unsafe-html.js"

export function renderIcon(name) {
  return unsafeHTML(window.icons[name])
}