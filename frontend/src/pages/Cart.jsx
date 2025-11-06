import React from 'react'
import './cart.css'

function loadCart() {
  try {
    const raw = localStorage.getItem('cart')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items) {
  localStorage.setItem('cart', JSON.stringify(items))
}

function formatCurrency(n) {
  const v = Number(n || 0)
  return `₹${v.toFixed(2)}`
}

export default function Cart() {
  const [items, setItems] = React.useState(() => {
    const arr = loadCart()
    // Merge duplicates by id+options
    const map = new Map()
    for (const it of arr) {
      const key = `${it.id}-${JSON.stringify(it.options || {})}`
      const prev = map.get(key)
      if (prev) {
        prev.qty = Number(prev.qty || 1) + Number(it.qty || 1)
      } else {
        map.set(key, { ...it, qty: Number(it.qty || 1) })
      }
    }
    const merged = Array.from(map.values())
    saveCart(merged)
    return merged
  })
  const [coupon, setCoupon] = React.useState('')
  const [couponApplied, setCouponApplied] = React.useState(false)
  // Add shipping method state and computed shipping cost
  const [shippingMethod, setShippingMethod] = React.useState('free')
  const shippingCost = shippingMethod === 'flat' ? 10 : shippingMethod === 'pickup' ? 15 : 0

  const updateItems = (next) => {
    setItems(next)
    saveCart(next)
  }

  const changeQty = (idx, delta) => {
    const next = [...items]
    const item = next[idx]
    const newQty = Math.max(1, (item.qty || 1) + delta)
    item.qty = newQty
    updateItems(next)
  }

  const removeItem = (idx) => {
    const next = items.filter((_, i) => i !== idx)
    updateItems(next)
  }

  const clearCart = () => {
    updateItems([])
  }
  const subtotal = items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.qty || 1), 0)
  const discount = couponApplied ? subtotal * 0.10 : 0
  const orderTotal = Math.max(0, subtotal - discount) + shippingCost

  return (
    <section className="cart-page" aria-label="Shopping cart">
      <div className="cart-title-row">
        <h1 className="cart-title">Shopping cart</h1>
        {items.length > 0 && (
          <button className="clear-btn" onClick={clearCart} aria-label="Clear cart">Clear cart</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <a className="cart-continue" href="/plants">Browse plants →</a>
        </div>
      ) : (
        <div className="cart-content">
          {/* Left: table */}
          <div className="cart-table-wrap">
            <table className="cart-table">
              <colgroup>
                <col style={{ width: 44 }} />       {/* remove */}
                <col />                              {/* product */}
                <col style={{ width: 120 }} />       {/* price */}
                <col style={{ width: 160 }} />       {/* quantity */}
                <col style={{ width: 140 }} />       {/* subtotal */}
              </colgroup>
              <thead>
                <tr>
                  <th className="col-remove"></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={`${it.id}-${idx}`}>
                    <td className="cell-remove">
                      <button
                        className="remove-btn"
                        aria-label={`Remove ${it.name}`}
                        onClick={() => removeItem(idx)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </td>

                    <td className="cell-product">
                      <img className="cart-thumb" src={it.image} alt={it.name} />
                      <div className="cart-item-info">
                        <div className="cart-item-name">{it.name}</div>
                        {it.options && (
                          <div className="cart-item-options">
                            {Object.entries(it.options).map(([k, v]) => (
                              <span key={k} className="opt-pill">{k}: {String(v)}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="cell-price">{formatCurrency(it.price)}</td>

                    <td className="cell-qty">
                      <div className="qty-control">
                        <button aria-label="Decrease quantity" onClick={() => changeQty(idx, -1)}>−</button>
                        <span>{it.qty || 1}</span>
                        <button aria-label="Increase quantity" onClick={() => changeQty(idx, 1)}>＋</button>
                      </div>
                    </td>

                    <td className="cell-subtotal">
                      {formatCurrency(Number(it.price || 0) * Number(it.qty || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bottom tools: coupon */}
            <div className="cart-tools">
              <div className="coupon-group">
                <input
                  id="coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                />
                <button
                  className="apply-coupon"
                  onClick={() => setCouponApplied(coupon.trim().toUpperCase() === 'SAVE10')}
                >
                  Apply coupon
                </button>
              </div>
            </div>
          </div>

          {/* Right: totals card */}
          <aside className="cart-summary">
            <h2 className="summary-title">Cart totals</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            {couponApplied && (
              <div className="summary-row">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="summary-group">
              <div className="summary-row"><span>Shipping</span></div>
              <div className="shipping-options">
                <label>
                  <input
                    type="radio"
                    name="shipping"
                    value="free"
                    checked={shippingMethod === 'free'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  Free shipping
                </label>
                <label>
                  <input
                    type="radio"
                    name="shipping"
                    value="flat"
                    checked={shippingMethod === 'flat'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  Flat rate: {formatCurrency(10)}
                </label>
                <label>
                  <input
                    type="radio"
                    name="shipping"
                    value="pickup"
                    checked={shippingMethod === 'pickup'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  Pickup: {formatCurrency(15)}
                </label>
              </div>
              <div className="shipping-note-small">
                Shipping options will be updated during checkout.
              </div>
              <button className="calc-shipping" type="button">Calculate shipping</button>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span className="gt">{formatCurrency(orderTotal)}</span>
            </div>

            <button className="checkout-btn" onClick={() => alert('Checkout not implemented')}>
              Proceed to checkout
            </button>
          </aside>
        </div>
      )}
    </section>
  )
}