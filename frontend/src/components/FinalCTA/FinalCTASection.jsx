import React from 'react'
import { Link } from 'react-router-dom'
import './FinalCTASection.css'

export default function FinalCTASection() {
  const videoRef = React.useRef(null)
  const [showOverlay, setShowOverlay] = React.useState(false)

  React.useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    const attempt = v.play()
    if (attempt && typeof attempt.then === 'function') {
      attempt
        .then(() => setShowOverlay(false))
        .catch(() => setShowOverlay(true)) // show play button if blocked
    }
  }, [])

  const handlePlay = () => {
    const v = videoRef.current
    if (v) {
      v.play()
        .then(() => setShowOverlay(false))
        .catch(() => setShowOverlay(true))
    }
  }
  return (
    <section className="final-cta" aria-label="Final call to action">
      <div className="final-cta-inner">
        <div className="final-cta-left">
          <h2 className="final-cta-title">
            So, become a plant mom
            <br />
            or we might send you a present.
          </h2>

          <p className="final-cta-sub">
            Healthy, beautiful greenery delivered with care — picked for your space.
          </p>

          <div className="final-cta-actions">
            <Link
              className="cta-btn cta-btn-primary cta-btn-xl"
              to="/plants#top"
              aria-label="Shop plants"
            >
              Shop Now
            </Link>
          </div>
        </div>

        <div className="final-cta-right">
          <div className="video-wrapper">
            <video
              className="cta-video"
              ref={videoRef}
              src="/videos/plant.mp4"
              playsInline
              muted
              loop
              autoPlay
              poster="/logo512.png"
              aria-label="Plants in motion"
            />
            <div className="video-overlay" style={{ display: showOverlay ? 'flex' : 'none' }}>
              <button
                type="button"
                className="video-play-btn"
                aria-label="Play video"
                onClick={handlePlay}
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}