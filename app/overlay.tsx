"use client";

import { useEffect, useRef, useState } from "react";
import VideoCard from "./video-card";
import { IconActions } from "./card-actions";

// Scrollable intro: a single full-height card. Scrolling past it fades the
// overlay out to reveal the homepage.

// Index of the final intro card. Stepping past it dismisses.
const LAST_STEP = 0;

export default function Overlay() {
  // Which intro card is in view: 0 = video card.
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  // Once the fade-out finishes we fully remove the overlay (display:none) so it
  // no longer sits over the homepage — `pointer-events-none` alone doesn't
  // reliably let scroll/wheel reach the iframe behind it.
  const [hidden, setHidden] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const lockedRef = useRef(false);
  const idleTimerRef = useRef<number | null>(null);

  // Intercept wheel/touch so ONE gesture moves exactly ONE step — a fast swoop
  // can't blow through every card. After a step we stay locked for the rest of
  // the gesture: the STRONG part of a flick (deltas above MOMENTUM_FLOOR) keeps
  // pushing the "gesture end" timer out, so one flick can never skip a card.
  // The fix vs. before: a flick's momentum *tail* dribbles out tiny deltas for
  // a long time — if those reset the timer too, the lock never releases and
  // scrolling feels dead. So tail ticks below MOMENTUM_FLOOR are ignored; once
  // momentum fades the lock releases after just QUIET_MS, and the next
  // deliberate scroll advances promptly.
  const NEW_GESTURE = 6; // min delta to start a step
  const MOMENTUM_FLOOR = 4; // below this, treat input as a fading momentum tail
  const QUIET_MS = 80; // input gap (of real input) that marks the gesture's end

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const advance = (dir: number) => {
      const next = stepRef.current + dir;
      if (next < 0) return; // already on the first card
      if (next > LAST_STEP) {
        setDismissed(true); // stepping past the last card fades into the page
        return;
      }
      stepRef.current = next;
      setStep(next);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Only meaningful input keeps the gesture alive. The strong part of a
      // flick defers the gesture-end (holding the lock so it can't skip a
      // card); the fading momentum tail (sub-floor ticks) is ignored, so the
      // lock releases QUIET_MS after momentum actually dies — not seconds later.
      if (Math.abs(e.deltaY) >= MOMENTUM_FLOOR) {
        if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = window.setTimeout(() => {
          lockedRef.current = false;
        }, QUIET_MS);
      }

      if (lockedRef.current) return;
      if (Math.abs(e.deltaY) < NEW_GESTURE) return;
      lockedRef.current = true;
      advance(e.deltaY > 0 ? 1 : -1);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (lockedRef.current) return;
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) < 40) return;
      lockedRef.current = true;
      advance(dy > 0 ? 1 : -1);
    };
    const onTouchEnd = () => {
      lockedRef.current = false;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Reopen the intro from the very first card.
  const reopen = () => {
    stepRef.current = 0;
    lockedRef.current = false;
    setStep(0);
    setHidden(false);
    setDismissed(false);
  };

  return (
    <>
      <div
        ref={containerRef}
        onTransitionEnd={(e) => {
          // Only the container's own fade-out should hide it — ignore bubbled
          // transitionend events from the card crossfades.
          if (dismissed && e.target === e.currentTarget) setHidden(true);
        }}
        className={`fixed inset-0 z-[9999] overflow-hidden bg-white transition-opacity duration-[700ms] ease-in-out ${
          hidden ? "hidden" : ""
        } ${dismissed ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <div className="relative h-full w-full">
          {/* First card — fades out as the next step fades in. */}
          <div
            className="absolute inset-0 flex items-center justify-center px-8 py-8 transition-opacity duration-700 ease-in-out min-[1080px]:px-24"
            style={{
              opacity: step === 0 ? 1 : 0,
              pointerEvents: step === 0 ? "auto" : "none",
            }}
          >
            {/* Column matches the card's width so the wordmark can sit against
                the card's right edge; equal flex spacers keep the card centered
                and center the wordmark in the white gap below it. */}
            <div className="flex h-full w-full max-w-[min(100%,calc((100vh_-_10rem_-_8px)*9/16))] flex-col min-[1080px]:max-w-[min(100%,calc((100vh_-_10rem_-_8px)*16/9))]">
              <div className="min-h-0 flex-1" />
              <div className="shrink-0">
                <VideoCard />
              </div>
              <div className="min-h-0 flex-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating quick-action buttons over the homepage, once the intro is gone. */}
      {dismissed && (
        <>
          {/* Mobile: full-width centered bar with evenly spread buttons. */}
          <div className="fixed inset-x-6 bottom-6 z-[10000] flex gap-1 rounded-3xl border border-[#1f2b3b]/50 bg-[#1f2b3b]/55 p-2 shadow-lg shadow-black/20 backdrop-blur-md min-[1080px]:hidden">
            <IconActions withLabels uniform seamless fluid onAction={reopen} />
          </div>
          {/* Desktop: compact pill pinned bottom-left. */}
          <div className="fixed bottom-8 left-8 z-[10000] hidden gap-1 rounded-3xl border border-[#1f2b3b]/50 bg-[#1f2b3b]/55 p-2 shadow-lg shadow-black/20 backdrop-blur-md min-[1080px]:flex">
            <IconActions withLabels uniform seamless onAction={reopen} />
          </div>
        </>
      )}
    </>
  );
}
