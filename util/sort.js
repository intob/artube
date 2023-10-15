export function sortAlphabetically(a, b, getFieldValueFn) {
  const fieldA = getFieldValueFn(a)?.toUpperCase()
  const fieldB = getFieldValueFn(b)?.toUpperCase()
  if (fieldA < fieldB) {
    return -1
  }
  if (fieldA > fieldB) {
    return 1
  }
  return 0
}