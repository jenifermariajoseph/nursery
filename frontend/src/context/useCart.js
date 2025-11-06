import React from 'react'
import { CartAPI } from './cart'

export function useCart() {
  const [items, setItems] = React.useState(() => CartAPI.get())
  const refresh = () => setItems(CartAPI.get())
  const add = async (item) => { setItems(CartAPI.add(item)) }
  const update = async (item, qty) => { setItems(CartAPI.update(item, qty)) }
  const remove = async (item) => { setItems(CartAPI.remove(item)) }
  const clear = async () => { setItems(CartAPI.clear()) }
  return { items, add, update, remove, clear, refresh }
}