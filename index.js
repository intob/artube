import { connectWallet } from "./util/wallet.js"

window.arweave = window.Arweave.init()

export const routes = [
  {
    path: "",
    component: "at-browse",
    action: async() => await import("./components/app/browse.js")
  },
  {
    path: "connect-wallet",
    action: connectWallet
  },
  {
    path: "create-video",
    component: "at-create-video",
    action: async() => await import("./components/app/create-video.js")
  },
  {
    path: "channel/:address",
    component: "at-channel",
    action: async() => await import("./components/app/channel.js")
  },
  {
    path: "watch/:videotxid",
    component: "at-watch",
    action: async() => await import("./components/app/watch.js")
  }
]

// persist route in session
addEventListener("hashchange", e => {
  const route = new URL(e.newURL).hash
  sessionStorage.route = route
})

// icon imports
window.icons = {
  // new
  "logout": await (await fetch("/img/logout.svg")).text(),
  "play": await(await fetch("/img/play.svg")).text(),
  "upload": await (await fetch("/img/upload.svg")).text(),
  "video-file": await(await fetch("/img/video-file.svg")).text(),
  "wallet": await(await fetch("/img/wallet.svg")).text(),
}

// component imports
//
// app
import("./components/app/nav/bar.js")
import("./components/app/nav/dropdown.js")
import("./components/app/create-video.js")
import("./components/app/teaser.js")
// generic
import("./components/generic/button.js")
import("./components/generic/card.js")
import("./components/generic/file-input.js")
import("./components/generic/icon-button.js")
import("./components/generic/link.js")
import("./components/generic/loader.js")
import("./components/generic/router.js")
import("./components/generic/tabs.js")
import("./components/generic/text-input.js")
import("./components/generic/textarea.js")
import("./components/generic/toast.js")
