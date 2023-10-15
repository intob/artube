/**
 * @param {File} file 
 * @returns {Promise<String>}
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = () => {
      reject("failed to read file")
    }
    reader.readAsText(file)
  })
}

/**
 * @param {File} file 
 * @returns {Promise<String>}
 */
export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = () => {
      reject("failed to read file")
    }
    reader.readAsArrayBuffer(file)
  })
}