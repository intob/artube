export async function getChannelTxId(address) {
  const q = {
    query: `
    {
      transactions(
        owners: ["${address}"]
        tags: [
          {
            name: "App-Name",
            values: ["artube"]
          },
          {
            name: "Artube-Type",
            values: ["channel"]
          }
        ]
      ) {
        edges {
          node {
            id
          }
        }
      }
    }`
  }
  const queryResp = await window.arweave.api.post("/graphql", q)
  const tx = queryResp.data.data.transactions.edges.map(e => e.node)[0]
  return tx?.id
}

export async function getChannelAvatarTxId(address) {
  const q = {
    query: `
    {
      transactions(
        owners: ["${address}"]
        tags: [
          {
            name: "App-Name",
            values: ["artube"]
          },
          {
            name: "Artube-Type",
            values: ["avatar"]
          }
        ]
      ) {
        edges {
          node {
            id
          }
        }
      }
    }`
  }
  const queryResp = await window.arweave.api.post("/graphql", q)
  const tx = queryResp.data.data.transactions.edges.map(e => e.node)[0]
  return tx?.id
}