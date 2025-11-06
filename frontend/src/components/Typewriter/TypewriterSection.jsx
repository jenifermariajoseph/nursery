import React, { useEffect, useState } from 'react'
import './TypewriterSection.css'

export default function TypewriterSection() {
  const phrases = React.useMemo(
    () => [
      'Air Purifying',
      'Low Maintenance',
      'Hydrating for Spaces',
      'Soothing Greenery',
      'Pet-Friendly Options',
    ],
    []
  )
  const typingSpeed = 80       // ms per char
  const deletingSpeed = 50     // ms per char when deleting
  const pauseMs = 1200         // hold full phrase before deleting

  const [displayText, setDisplayText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIndex]
    let timer

    if (isDeleting) {
      timer = setTimeout(() => {
        const next = current.slice(0, Math.max(0, charIndex - 1))
        setDisplayText(next)
        setCharIndex((c) => Math.max(0, c - 1))
        if (next.length === 0) {
          setIsDeleting(false)
          setPhraseIndex((i) => (i + 1) % phrases.length)
        }
      }, deletingSpeed)
    } else {
      timer = setTimeout(() => {
        const next = current.slice(0, Math.min(current.length, charIndex + 1))
        setDisplayText(next)
        setCharIndex((c) => Math.min(current.length, c + 1))
        if (next.length === current.length) {
          // pause at full phrase then start deleting
          setTimeout(() => setIsDeleting(true), pauseMs)
        }
      }, typingSpeed)
    }

    return () => clearTimeout(timer)
  }, [phrases, phraseIndex, charIndex, isDeleting])

  return (
    <section className="typewriter-section" aria-label="Plant benefits">
      <div className="typewriter-inner">
        <h3 className="tw-subtitle">Why choose our plants?</h3>
        <div className="tw-line" aria-live="polite">
          <span className="tw-prefix">Benefits: </span>
          <span className="tw-text">{displayText}</span>
          <span className="tw-caret" />
        </div>
        <p className="tw-caption">
          Beautiful, healthy greenery with the right care for your space.
        </p>
      </div>
    </section>
  )
}