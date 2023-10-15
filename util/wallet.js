import { Toast } from "../components/generic/toast.js"

export async function connectWallet() {
  if (!window.arweaveWallet) {
    Toast.notify("You need an Arweave wallet", {
      msg: "Install a wallet browser extension",
      linkUrl: "https://www.arconnect.io/download",
      linkLabel: "Download ArConnect"
    })
    return
  }
  await window.arweaveWallet.connect(
    [ "ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH" ],
    {
      name: "ArTube",
      logo: "https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk"
    }
  )
  Toast.notify("Wallet connected")
  dispatchEvent(new CustomEvent("at-wallet-connected"))
  window.location = "#/"
}