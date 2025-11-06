import React, { useEffect, useRef } from 'react'
import './ModelSection.css'

export default function ModelSection() {
  const mvRef = useRef(null)

  // Load <model-viewer> via CDN once
  useEffect(() => {
    const alreadyLoaded = window.customElements?.get?.('model-viewer')
    if (!alreadyLoaded) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'
      script.setAttribute('data-model-viewer', '')
      document.head.appendChild(script)
    }
  }, [])

  // Models to cycle through
  const [modelIndex, setModelIndex] = React.useState(0)
  const models = [
    { src: '/models/plant.glb', label: 'Plant' },
    { src: '/models/flower.glb', label: 'Flower Pot' },
    { src: '/models/ficus.glb', label: 'Ficus' },
  ]
  const currentModel = models[modelIndex]

  return (
    <section className="model-section" id="model">
      <h2 className="model-heading">Explore in 3D</h2>
      <div className="model-wrapper">
        <model-viewer
          ref={mvRef}
          src={currentModel.src}
          key={currentModel.src}
          alt={`${currentModel.label} 3D model`}
          camera-controls
          auto-rotate
          ar
          ar-modes="webxr scene-viewer quick-look"
          environment-image="https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k_HDR.hdr"
          shadow-intensity="1"
          exposure="0.9"
          style={{ backgroundColor: 'transparent' }}
        ></model-viewer>

        {/* Plant benefits — clean, concise labels */}
        <div className="mv-badge mv-badge--left">
          <div className="mv-badge-icon" aria-hidden>💨</div>
          <div className="mv-badge-text">Air Purifying</div>
        </div>

        <div className="mv-badge mv-badge--right">
          <div className="mv-badge-icon" aria-hidden>🪴</div>
          <div className="mv-badge-text">Low Maintenance</div>
        </div>

        <div className="mv-badge mv-badge--bottom">
          <div className="mv-badge-icon" aria-hidden>💧</div>
          <div className="mv-badge-text">Hydrating</div>
        </div>

        {/* Bottom controls: model label + Next button */}
        <div className="model-controls">
          <span className="model-label">{currentModel.label}</span>
          <button
            type="button"
            className="mv-btn mv-btn-next"
            aria-label="Show next model"
            onClick={() => setModelIndex((i) => (i + 1) % models.length)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}