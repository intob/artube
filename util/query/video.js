export async function getVideos(address) {
  const q = {
    query: `
    {
      transactions(
        ${address ? `owners: ["${address}"]` : ""}
        tags: [
          {
            name: "App-Name",
            values: ["artube"]
          },
          {
            name: "Artube-Type",
            values: ["video"]
          }
        ]
      ) {
        edges {
          node {
            id
            owner {
              address
            }
            tags {
              name
              value
            }
          }
        }
      }
    }`
  }
  const resp = await window.arweave.api.post("/graphql", q)
  return resp.data.data.transactions.edges.map(e => e.node)
}

export async function getVideoMetadataTx(videoTxId) {
  const q = {
    query: `
    {
      transactions(
        tags: [
          {
            name: "App-Name",
            values: ["artube"]
          },
          {
            name: "Artube-Type",
            values: ["metadata"]
          },
          {
            name: "Artube-Video",
            values: ["${videoTxId}"]
          }
        ]
      ) {
        edges {
          node {
            id
            owner {
              address
            }
          }
        }
      }
    }`
  }
  const queryResp = await window.arweave.api.post("/graphql", q)
  const tx = queryResp.data.data.transactions.edges.map(e => e.node)[0]
  return tx
}

export async function getVideoPosterTxId(videoTxId) {
  const q = {
    query: `
    {
      transactions(
        tags: [
          {
            name: "App-Name",
            values: ["artube"]
          },
          {
            name: "Artube-Type",
            values: ["poster"]
          },
          {
            name: "Artube-Video",
            values: ["${videoTxId}"]
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