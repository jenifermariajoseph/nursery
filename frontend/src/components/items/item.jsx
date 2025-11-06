import React from 'react'
import { Link } from 'react-router-dom'
import './item.css'

export default function Item(props) {
  const { id, image, name, new_price, old_price, bestSeller } = props;
  // Calculate percentage off dynamically
  const hasDiscount = old_price != null && Number(old_price) > Number(new_price);
  const discountPct = hasDiscount
    ? Math.round((1 - Number(new_price) / Number(old_price)) * 100)
    : 0;

  const [added, setAdded] = React.useState(false)

  const handleAddToCart = () => {
    try {
      const itemToAdd = {
        id: id ?? `${name}-${new_price}`,
        name,
        image,
        price: Number(new_price),
        old_price: old_price != null ? Number(old_price) : undefined,
        qty: 1,
      }
      const raw = localStorage.getItem('cart')
      const cart = raw ? JSON.parse(raw) : []
      const idx = cart.findIndex((i) => i.id === itemToAdd.id)
      if (idx >= 0) {
        cart[idx].qty += 1
      } else {
        cart.push(itemToAdd)
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      setAdded(true)
      setTimeout(() => setAdded(false), 1200)
    } catch (e) {
      console.error('Failed to add to cart:', e)
    }
  }

  return (
    <article className="item">
      <Link
        to={`/product/${props.id ?? encodeURIComponent(props.name)}`}
        className="item-link"
        aria-label={`View ${props.name}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="item-media">
          <img src={image} alt={name} />
          {bestSeller && <span className="badge badge-left">Best Seller</span>}
          {hasDiscount && (
            <span className="badge badge-right">{discountPct}% OFF</span>
          )}
        </div>

        <div className="item-body">
          <div className="item-rating">
            <span className="stars">★★★★★</span>
            <span className="score">4.8 | 117</span>
          </div>

          <h3 className="item-name">{name}</h3>

          <div className="item-prices">
            <span className="item-price-new">₹{new_price}</span>
            {old_price != null && (
              <span className="item-price-old">₹{old_price}</span>
            )}
          </div>

          <div className="item-tags">
            <span className="pill">Air Purifying</span>
          </div>
        </div>
      </Link>

      <div className="item-body">
        {/* Keep the add to cart outside the link for better UX */}
        <button
          className="item-add-btn"
          onClick={handleAddToCart}
          aria-label={`Add ${name} to cart`}
        >
          Add to cart
        </button>
        {added && (
          <div className="add-toast" role="status">Added to cart ✓</div>
        )}
      </div>
    </article>
  )
}