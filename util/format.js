/**
 * 
 * @param {Date} date 
 * @returns {String} formatted date-time string
 */
export function fmtDate(date) {
  return new Date(date).toLocaleString()
}

/**
 * 
 * @param {Number} bytes number of bytes 
 * @returns {String} formatted size
 */
export function fmtSize(bytes) {
  const kB = Math.floor(bytes/1000)
  if (kB < 1) {
    return `${bytes} B`
  }
  const MB = Math.floor(bytes/1000000)
  if (MB < 1) {
    return `${kB} kB`
  }
  const GB = bytes/1000000000
  if (GB < 1) {
    return `${MB} MB`
  }
  return `${GB.toFixed(2)}GB`
}

/**
 * 
 * @param {Number} durationInMs miliseconds 
 * @returns {String} formatted duration
 */
export function fmtDuration(durationInMs) {
  const min = Math.floor(durationInMs/1000/60)
  const sec = Math.round(durationInMs/1000 % 60)
  return `${min}:${sec.toString().padStart(2, "0")}`
}

/**
 * Shorten an id by replacing the middle with padding
 * E.g:
 * 6d8f443f-6e1e-4e9a-ac41-bf871cd442eb
 * will be returned as
 * 6d8f...42eb
 * with paddingString="." & paddingLength=3
 * @param {String} id
 * @param {String} paddingString char/string to place as padding between start & end
 * @param {*} paddingLength number of padding chars/strings to place
 * @returns 
 */
export function shortenId(id, paddingChar=".", paddingLength=3) {
  return `${id.slice(0, 4)}${"".padStart(paddingLength, paddingChar)}${id.slice(-4)}`
}

export function buildSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}