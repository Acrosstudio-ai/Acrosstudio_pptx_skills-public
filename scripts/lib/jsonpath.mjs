// Get/set dotted paths like "plugins.0.version" on plain JSON objects.
// Immutable: setPath returns a new object, never mutates the input.

const segments = (path) => path.split('.')

export function getPath(obj, path) {
  return segments(path).reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

export function setPath(obj, path, value) {
  const [head, ...rest] = segments(path)
  const clone = Array.isArray(obj) ? [...obj] : { ...obj }
  if (rest.length === 0) {
    clone[head] = value
  } else {
    clone[head] = setPath(obj?.[head] ?? {}, rest.join('.'), value)
  }
  return clone
}
