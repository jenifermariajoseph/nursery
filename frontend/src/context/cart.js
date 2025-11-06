// Simple adapter with localStorage now; swap with real HTTP later.
const STORAGE_KEY = 'cart'

function read() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}
function write(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }

// Stable item key: id + options
function itemKey(it) { return `${it.id}-${JSON.stringify(it.options || {})}` }

export const CartAPI = {
  get() {
    const items = read()
    const map = new Map()
    for (const it of items) {
      const k = itemKey(it)
      const prev = map.get(k)
      if (prev) prev.qty += Number(it.qty || 1)
      else map.set(k, { ...it, qty: Number(it.qty || 1) })
    }
    const merged = [...map.values()]
    write(merged)
    return merged
  },
  add(item) {
    const items = read()
    const k = itemKey(item)
    const idx = items.findIndex((i) => itemKey(i) === k)
    if (idx >= 0) items[idx].qty += Number(item.qty || 1)
    else items.push({ ...item, qty: Number(item.qty || 1) })
    write(items)
    return this.get()
  },
  update(keyItem, nextQty) {
    const items = read()
    const k = itemKey(keyItem)
    const idx = items.findIndex((i) => itemKey(i) === k)
    if (idx >= 0) items[idx].qty = Math.max(1, Number(nextQty))
    write(items)
    return this.get()
  },
  remove(keyItem) {
    const items = read()
    const k = itemKey(keyItem)
    write(items.filter((i) => itemKey(i) !== k))
    return this.get()
  },
  clear() { write([]); return [] },
}