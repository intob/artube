/**
 * Starts a file download from a blob
 * @param {Blob} blob 
 */
export function startDownload(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.setAttribute("download", fileName)
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Get a subtype from a MIME type
 * For example, giving "video/mp4" will return "mp4"
 * @param {String} mimeType 
 * @returns {String} subtype
 */
export function getSubtypeFromMimeType(mimeType) {
  if (!mimeType || mimeType === "") {
    throw new Error("missing MIME type")
  }
  return mimeType.slice(mimeType.indexOf("/")+1)
}