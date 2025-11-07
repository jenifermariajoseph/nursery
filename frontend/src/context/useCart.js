import React from 'react'
import { useAuth } from './auth'

export function useCart() {
  const { token } = useAuth()
  const [items, setItems] = React.useState([])
  const [subtotal, setSubtotal] = React.useState(0)

  const headers = React.useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  )

  const refresh = React.useCallback(async (sessionId = 'anon') => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/cart?sessionId=${encodeURIComponent(sessionId)}`,
        { headers }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setItems(data.items || [])
      setSubtotal(data.subtotalCents || 0)
    } catch (err) {
      console.error('Cart refresh failed:', err)
      setItems([])
      setSubtotal(0)
    }
  }, [headers])

  const update = React.useCallback(async (id, qty) => {
    await fetch(`http://localhost:4000/api/cart/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ qty }),
    })
    await refresh()
  }, [headers, refresh])

  const remove = React.useCallback(async (id) => {
    await fetch(`http://localhost:4000/api/cart/items/${id}`, {
      method: 'DELETE',
      headers,
    })
    await refresh()
  }, [headers, refresh])

  const add = React.useCallback(async (payload) => {
    const res = await fetch('http://localhost:4000/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(payload),
    })
    if (res.ok) await refresh()
  }, [headers, refresh])

  React.useEffect(() => { refresh() }, [refresh])

  return { items, subtotal, refresh, add, update, remove }
}