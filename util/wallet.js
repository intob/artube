import { Toast } from "../components/generic/toast.js"

export async function disconnectWallet() {
  if (!window.arweaveWallet) {
    return
  }
  await window.arweaveWallet.disconnect()
  Toast.notify("Wallet disconnected")
  dispatchEvent(new CustomEvent("at-wallet-disconnected"))
  window.location = "#/"
}

export async function connectWallet() {
  if (!window.arweaveWallet) {
    window.location = "#/no-wallet"
    return
  }
  await window.arweaveWallet.connect(
    [
      "ACCESS_ADDRESS",
      "ACCESS_ARWEAVE_CONFIG",
      "SIGN_TRANSACTION",
      "DISPATCH"
    ],
    {
      name: "artube"
    }
  )
  Toast.notify("Wallet connected")
  dispatchEvent(new CustomEvent("at-wallet-connected"))
  window.location = "#/"
}

export async function getWalletAddress() {
  if (!window.arweaveWallet) {
    return
  }
  try {
    return await window.arweaveWallet.getActiveAddress()
  } catch (e) {
    return
  }
}