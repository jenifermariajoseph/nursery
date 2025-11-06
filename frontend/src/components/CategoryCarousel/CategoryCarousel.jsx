import React, { useRef } from 'react'
import Item from '../items/item'
import './CategoryCarousel.css'

export default function CategoryCarousel({ title, items = [], anchorId }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const track = trackRef.current
    if (!track) return
    const amount = Math.min(320, track.clientWidth * 0.4)
    track.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <section id={anchorId} className="category-carousel" aria-label={`${title} carousel`}>
      <div className="cc-head">
        <h2 className="cc-title">{title}</h2>
        <div className="cc-actions">
          <button className="cc-btn" onClick={() => scrollBy(-1)} aria-label="Scroll left">‹</button>
          <button className="cc-btn" onClick={() => scrollBy(1)} aria-label="Scroll right">›</button>
        </div>
      </div>
      <div className="cc-track" ref={trackRef}>
        {items.map((it) => (
          <div className="cc-card" key={`${title}-${it.id ?? it.name}`}>
            <Item
              id={it.id}
              image={it.image}
              name={it.name}
              new_price={it.new_price}
              old_price={it.old_price}
              bestSeller={it.bestSeller}
            />
          </div>
        ))}
      </div>
    </section>
  )
}