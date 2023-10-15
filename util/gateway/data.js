export async function fetchData(txId) {
  return fetch(buildDataUrl(txId))
}

export function buildDataUrl(txId) {
  const g = window.arweave.network.api.config
  return `${g.protocol}://${g.host}:${g.port}/${txId}`
}