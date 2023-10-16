export async function getPrice(bytes) {
  const resp = await window.arweave.api.get(`price/${bytes}`)
  return window.arweave.ar.winstonToAr(resp.data)
}