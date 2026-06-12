const refs = new Map()

export function registerEditorRef(id, ref) {
  if (id && ref) refs.set(id, ref)
}

export function unregisterEditorRef(id) {
  if (id) refs.delete(id)
}

export function getEditorRef(id) {
  return refs.get(id) ?? null
}
