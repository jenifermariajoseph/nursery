import React from 'react'
import './PlantsBanner.css'

export default function PlantsBanner() {
  return (
    <section id="top" className="plants-banner" aria-label="Plants page banner">
      <img
        className="plants-banner-image"
        src="/images/plant%20banner.jpg"
        alt="Fresh plant banner"
      />
      <div className="plants-banner-overlay">
        <h1
          className="plants-banner-title"
          style={{
            fontFamily:
              '"PP Neue Montreal", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            fontWeight: 700
          }}
        >
          For the New You<br /> at 20% OFF
        </h1>
      </div>
    </section>
  )
}