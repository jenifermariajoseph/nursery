
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./StickySlider.css";

import slides from "./slides"; // use external slides.js

gsap.registerPlugin(ScrollTrigger);

export default function StickySlider() {
  const sliderRef = useRef(null);
  const titleRef = useRef(null);
  const linkRef = useRef(null);           // NEW: control Explore link
  const imageRefs = useRef([]);
  const currentTitleIndexRef = useRef(0);

  useEffect(() => {
    const root = sliderRef.current;
    if (!root || slides.length === 0) return;

    // Initialize layers and overlay text/link
    imageRefs.current.forEach((img, i) => {
      gsap.set(img, {
        autoAlpha: i === 0 ? 1 : 0,
        scale: i === 0 ? 1.04 : 1.0,
        willChange: "opacity, transform",
      });
    });
    if (titleRef.current) {
      titleRef.current.textContent = slides[0].title;
    }
    if (linkRef.current) {
      linkRef.current.href = slides[0].url;
    }

    const transitions = slides.length - 1;
    const perTransition = 500;
    const totalDistance = transitions * perTransition + 200;

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: `+=${totalDistance}`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress * transitions;
        const idx = Math.floor(p);
        const frac = p - idx;
        const nextIdx = Math.min(idx + 1, slides.length - 1);

        imageRefs.current.forEach((img, i) => {
          if (i === idx) {
            gsap.set(img, { autoAlpha: 1 - frac, scale: 1.04 - 0.04 * frac });
          } else if (i === nextIdx) {
            gsap.set(img, { autoAlpha: frac, scale: 1.0 + 0.04 * (1 - frac) });
          } else {
            gsap.set(img, { autoAlpha: 0, scale: 1.0 });
          }
        });

        const titleIndex = frac > 0.5 ? nextIdx : idx;
        if (titleIndex !== currentTitleIndexRef.current) {
          currentTitleIndexRef.current = titleIndex;
          if (titleRef.current) titleRef.current.textContent = slides[titleIndex].title;
          if (linkRef.current) linkRef.current.href = slides[titleIndex].url;
        }
      },
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf("*");
    };
  }, []);

  return (
    <section className="sticky-slider" ref={sliderRef}>
      <div className="slide-stack">
        {slides.map((s, i) => (
          <img
            key={i}
            ref={(el) => (imageRefs.current[i] = el)}
            src={s.image}
            alt={s.title}
          />
        ))}
      </div>

      <div className="slide-info">
        <div className="overlay-row">
          <span className="overlay-left">Essence</span>
          <h2 className="overlay-title" ref={titleRef}>{slides[0].title}</h2>
          <a className="overlay-link" ref={linkRef} href={slides[0].url}>Explore ↗</a>
        </div>
        {/* Removed the separate overlay-line */}
        {/* <div className="overlay-line" /> */}
      </div>
    </section>
  );
}
