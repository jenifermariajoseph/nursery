import React from 'react'
import './cart.css'
import { useCart } from '../context/useCart'

export default function Cart() {
  const { items, subtotal, refresh, update, remove } = useCart()
  const [couponApplied] = React.useState(false)
  const [shippingMethod, setShippingMethod] = React.useState('free')

  React.useEffect(() => { refresh() }, [refresh])
  const clearCart = async () => {
    for (const it of items) {
      await remove(it.id)
    }
    await refresh()
  }

  const formatCurrency = (n) => {
    const v = Number(n || 0)
    return `₹${v.toFixed(2)}`
  }
  const subtotalRs = subtotal / 100
  const discount = 0 // keep coupon logic if needed
  const orderTotal = Math.max(0, subtotalRs - discount)

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
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="cell-remove">
                      <button
                        aria-label={`Remove ${it.name}`}
                        onClick={() => remove(it.id)}
                      >
                        ✕
                      </button>
                    </td>
                    <td className="cell-product">
                      <div className="prod-cell">
                        <img src={it.image_url || '/images/placeholder.png'} alt={it.name} />
                        <div className="prod-meta">
                          <div className="prod-title">{it.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="cell-price">{formatCurrency(it.price_cents / 100)}</td>
                    <td className="cell-qty">
                      <div className="qty-control">
                        <button onClick={() => update(it.id, Math.max(1, it.quantity - 1))}>−</button>
                        <span>{it.quantity}</span>
                        <button onClick={() => update(it.id, it.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td className="cell-subtotal">
                      {formatCurrency((it.price_cents * it.quantity) / 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right: totals card */}
          <aside className="cart-summary">
            <h2 className="summary-title">Cart totals</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotalRs)}</span>
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