import React from 'react'
import { useParams, Link } from 'react-router-dom'
import './product.css'
import plant_collections from '../components/assets/plant_collections'
import { succulentsCacti, herbs, tropical, lowLight, veggies } from '../components/assets/plant_category_items'

export default function Product() {
  const { productId } = useParams()

  const allPlants = React.useMemo(
    () => [
      ...succulentsCacti,
      ...herbs,
      ...tropical,
      ...lowLight,
      ...veggies,
      ...plant_collections,
    ],
    []
  )

  const product =
    allPlants.find((p) => String(p.id) === String(productId)) ||
    allPlants.find((p) => String(p.name) === String(productId)) ||
    null

  const [selectedImgIndex, setSelectedImgIndex] = React.useState(0)
  const gallery = React.useMemo(() => {
    const g = product?.gallery
    if (Array.isArray(g) && g.length > 0) return g
    // Fallback: use the main image thrice for the gallery feel
    return product ? [product.image, product.image, product.image] : []
  }, [product])

  const [size, setSize] = React.useState('M')            // Pot size
  const [color, setColor] = React.useState('terracotta') // Pot color
  const [qty, setQty] = React.useState(1)
  const [added, setAdded] = React.useState(false)

  const handleAddToCart = () => {
    if (!product) return
    try {
      const itemToAdd = {
        id: product.id ?? product.name,
        name: product.name,
        image: product.image,
        price: Number(product.new_price),
        old_price: product.old_price != null ? Number(product.old_price) : undefined,
        qty,
        options: { size, color },
      }
      const raw = localStorage.getItem('cart')
      const cart = raw ? JSON.parse(raw) : []
      const key = (i) => `${i.id}-${JSON.stringify(i.options||{})}`
      const idx = cart.findIndex((i) => key(i) === key(itemToAdd))
      if (idx >= 0) {
        cart[idx].qty += qty
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

  const [tab, setTab] = React.useState('discussion')

  if (!product) {
    return (
      <section className="product-page">
        <h2 className="prod-notfound-title">Product not found</h2>
        <p className="prod-notfound-sub">The requested plant doesn’t exist.</p>
        <Link to="/plants#top" className="prod-back-link">Go back to Plants</Link>
      </section>
    )
  }

  return (
    <section className="product-page" aria-label="Plant product details">
      <div className="prod-top">
        {/* Left: image gallery */}
        <div className="prod-gallery">
          <div className="prod-image-main">
            <img src={gallery[selectedImgIndex]} alt={product.name} />
          </div>
          <div className="prod-thumbs">
            {gallery.map((src, idx) => (
              <button
                key={idx}
                className={`thumb ${idx === selectedImgIndex ? 'active' : ''}`}
                onClick={() => setSelectedImgIndex(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <img src={src} alt={`${product.name} ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: info and actions */}
        <div className="prod-info">
          <h1 className="prod-title">{product.name}</h1>
          <div className="prod-rating">
            <span className="stars">★★★★★</span>
            <span className="score">(4.9)</span>
          </div>

          <div className="prod-price-row">
            <span className="prod-price">₹{product.new_price}</span>
            {product.old_price != null && (
              <span className="prod-price-old">₹{product.old_price}</span>
            )}
          </div>

          <div className="prod-option">
            <label className="opt-label">Available Pot Size</label>
            <div className="opt-pills">
              {['S', 'M', 'L'].map((s) => (
                <button
                  key={s}
                  className={`pill ${size === s ? 'active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="prod-option">
            <label className="opt-label">Pot Color</label>
            <div className="opt-pills">
              {['terracotta', 'white', 'black'].map((c) => (
                <button
                  key={c}
                  className={`pill ${color === c ? 'active' : ''}`}
                  onClick={() => setColor(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="prod-stock">Last 1 left — make it yours!</div>

          <div className="prod-actions">
            <div className="qty">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
              >
                ＋
              </button>
            </div>
            <button className="add-btn" onClick={handleAddToCart}>
              Add to cart
            </button>
            {added && <div className="add-toast">Added to cart ✓</div>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="prod-tabs" role="tablist">
        <button
          className={`tab ${tab === 'details' ? 'active' : ''}`}
          onClick={() => setTab('details')}
          role="tab"
        >
          The Details
        </button>
        <button
          className={`tab ${tab === 'reviews' ? 'active' : ''}`}
          onClick={() => setTab('reviews')}
          role="tab"
        >
          Ratings & Reviews
        </button>
        <button
          className={`tab ${tab === 'discussion' ? 'active' : ''}`}
          onClick={() => setTab('discussion')}
          role="tab"
        >
          Discussion
        </button>
      </div>

      {/* Sections */}
      {tab === 'details' && (
        <div className="prod-section">
          <h3>Plant Details</h3>
          <ul className="specs">
            <li>Air-purifying, low maintenance</li>
            <li>Light: Bright indirect or low light</li>
            <li>Water: Weekly, let soil dry between</li>
            <li>Pot sizes: S / M / L</li>
          </ul>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="prod-section">
          <h3>Ratings & Reviews</h3>
          <p>⭐️⭐️⭐️⭐️☆ 4.8 average from 117 buyers</p>
        </div>
      )}

      {tab === 'discussion' && (
        <div className="prod-section">
          <h3>Discussion</h3>
          <div className="discussion-list">
            <div className="comment">
              <strong>Kathryn</strong> The plant is healthy and looks great!
            </div>
            <div className="comment">
              <strong>Esther</strong> Arrived well-packed; thriving in my living room.
            </div>
            <div className="comment">
              <strong>Cameron</strong> Tips: avoid overwatering; loves indirect light.
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
