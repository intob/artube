import { hasValidToken, redirectToLogin } from "./auth.js"

/**
 * 
 * @param {String} url 
 * @param {{method, contentType, body, headers}} options
 * @returns 
 */
export async function authedFetch(url, options, parseJsonResponse = true) {
  if (!hasValidToken()) {
    setTimeout(redirectToLogin, 1000)
    throw "Your token expired, redirecting to login"
  }
  const resp = await fetch(url, {
    body: options?.body,
    method: options?.method || "GET",
    mode: "cors",
    headers: {
      Authorization: `Bearer ${localStorage.id_token}`,
      "Content-Type": options?.contentType || "application/json",
      ...options?.headers
    }
  })
  if (!resp.ok) {
    throw getMsgForFailedRequest(resp)
  }
  return parseJsonResponse ? resp.json() : resp.text()
}

function getMsgForFailedRequest(resp) {
  let msg = `Request failed with status ${resp.status}`
  if (resp.status === 403) {
    msg = "You are not authorized to make this request"
  }
  return msg
}

/**
 * 
 * @param {Object} params 
 * @returns 
 */
export function buildQuery(params) {
  let query = "?"
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== "") {
      query += `${key}=${encodeURIComponent(params[key])}&`
    }
  }
  // remove trailing '&'
  return query.slice(0, -1)
}

/**
 * Make a request with progress handling
 * @param {String} url
 * @param {{method, headers, body}} options
 * @param {function} progressHandler
 * @returns {Promise}
 */
export function requestWithProgress(url, options, progressHandler) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.responseType = "blob"
    req.addEventListener("progress", progressHandler)
    req.addEventListener("loadend", () => resolve(req.response))
    req.addEventListener("error", e => reject(e))
    req.upload.addEventListener("progress", progressHandler)
    req.upload.addEventListener("loadend", () => resolve(req.response))
    req.upload.addEventListener("error", e => reject(e))
    req.open(options.method || "GET", url)
    for (const header in options.headers) {
      // skip unsafe header
      if (header === "host") {
        continue
      }
      req.setRequestHeader(header, options.headers[header])
    }
    req.send(options.body)
  })
}