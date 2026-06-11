"use client";

import { useEffect, useState } from "react";

// Scroll-driven intro: Title -> CTA -> Chat, then the overlay fades out
// to reveal the homepage underneath. Placeholder text for now so the
// frame flow can be verified.
const CARDS = [
  { key: "title", text: "Title" },
  { key: "cta", text: "CTA" },
  { key: "chat", text: "Chat" },
];

export default function Overlay() {
  // step 0..CARDS.length-1 show a card; step === CARDS.length dismisses.
  const [step, setStep] = useState(0);

  const dismissed = step >= CARDS.length;

  useEffect(() => {
    if (dismissed) return;

    let lock = false;
    const advance = (dir: number) => {
      if (lock) return;
      lock = true;
      setStep((s) => Math.min(CARDS.length, Math.max(0, s + dir)));
      // debounce so one gesture moves one step
      window.setTimeout(() => {
        lock = false;
      }, 700);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 5) return;
      advance(e.deltaY > 0 ? 1 : -1);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) < 30) return;
      advance(dy > 0 ? 1 : -1);
      touchStartY = e.touches[0].clientY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [dismissed]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "white",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: dismissed ? 0 : 1,
        pointerEvents: dismissed ? "none" : "auto",
        transition: "opacity 600ms ease",
      }}
    >
      {CARDS.map((card, i) => (
        <div
          key={card.key}
          style={{
            position: "absolute",
            fontSize: "clamp(2rem, 8vw, 6rem)",
            fontWeight: 700,
            color: "#111",
            opacity: step === i ? 1 : 0,
            transform: step === i ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 500ms ease, transform 500ms ease",
            pointerEvents: "none",
          }}
        >
          {card.text}
        </div>
      ))}

      {!dismissed && (
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            fontSize: "0.875rem",
            color: "#888",
            letterSpacing: "0.05em",
          }}
        >
          scroll ↓ ({step + 1}/{CARDS.length})
        </div>
      )}
    </div>
  );
}
