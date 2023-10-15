import { html, LitElement } from "lit"
import { unsafeHTML } from "lit/directives/unsafe-html.js"
import { routes } from "../../index.js"

class Router extends LitElement {
  static properties = {
    matchToRender: { attribute: false },
  }

  constructor() {
    super()
    this.updatePath(location.hash.slice(1))
    addEventListener("hashchange", e => {
      this.updatePath(new URL(e.newURL).hash.slice(1))
    })
  }

  async updatePath(path) {
    const match = resolvePath(path)
    if (typeof match.route?.action === "function") {
      await match.route.action()
    }
    this.matchToRender = match
  }

  printAttributes(params) {
    if (!params) {
      return ""
    }
    let attr = ""
    for (const key in params) {
      attr += `${key}="${params[key]}" `
    }
    return attr
  }
  
  render() {
    const tag = this.matchToRender?.route?.component
    const attr = this.printAttributes(this.matchToRender?.params)
    if (tag) {
      return unsafeHTML(`<${tag} ${attr}></${tag}>`)
    }
    return html``
  }
}
customElements.define("x-router", Router)

function resolvePath(inputPath) {
  inputPath = stripExtraSlashes(inputPath)
  const inputSegments = inputPath.split("/")
  const params = {}
  const matches = routes.filter(route => {
    const routeSegments = route.path.split("/")
    // check segment count
    if (routeSegments.length !== inputSegments.length) {
      return false
    }
    // check each segment
    for (let i = 0; i < routeSegments.length; i++) {
      // if param, take value
      if (routeSegments[i].startsWith(":")) {
        params[routeSegments[i].slice(1)] = inputSegments[i]
        continue
      }
      // check that segment matches
      if (routeSegments[i] !== inputSegments[i]) {
        return false
      }
    }
    return true
  })
  if (matches.length !== 1) {
    console.error("path did not match with exactly 1 route", matches)
    return {}
  }
  return {
    params,
    route: matches[0]
  }
}

function stripExtraSlashes(path) {
  if (path.charAt(path.length-1) === "/") {
    path = path.slice(0, -1)
  }
  if (path.charAt(0) === "/") {
    path = path.slice(1)
  }
  return path
}