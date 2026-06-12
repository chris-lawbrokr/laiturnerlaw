"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Scale, HeartHandshake, Globe } from "lucide-react";
import VideoCard from "./video-card";
import CardActions, { IconActions } from "./card-actions";
import { rhymesDisplay } from "./fonts";

// Quick-link cards into the firm's key pages.
const QUESTIONS = [
  {
    title: "Free Case Evaluation",
    desc: "Tell us about your situation and get a no-obligation review.",
  },
  {
    title: "Our Team",
    desc: "Meet the attorneys fighting for the people of Oklahoma City.",
  },
  {
    title: "Practice Areas",
    desc: "Criminal defense, immigration, and family law representation.",
  },
  {
    title: "Office Details",
    desc: "Location, hours, and how to reach us in Oklahoma City.",
  },
];

// Scrollable intro: stacked full-height cards. Scrolling past the last card
// fades the overlay out to reveal the homepage. Placeholder text for now so
// the frame flow can be verified.

// Index of the final intro card (the chat card). Stepping past it dismisses.
const LAST_STEP = 1;

export default function Overlay() {
  // Which intro card is in view: 0 = video card, 1 = chat card.
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
              <div className="flex min-h-0 flex-1 items-center justify-end py-2">
                <img
                  src="/images/boxii.svg"
                  alt="Lai & Turner Law Firm PLLC"
                  className="w-28 min-[1080px]:w-40"
                />
              </div>
            </div>
          </div>
          {/* Second card — fades in over the first. */}
          <div
            className="absolute inset-0 flex items-center justify-center px-8 py-8 transition-opacity duration-700 ease-in-out min-[1080px]:px-24"
            style={{
              opacity: step === 1 ? 1 : 0,
              pointerEvents: step === 1 ? "auto" : "none",
            }}
          >
            <div className="relative mx-auto flex aspect-[1080/1920] w-full max-w-[min(100%,calc((100vh_-_10rem_-_8px)*9/16))] items-center justify-center overflow-hidden rounded-4xl border border-white/30 bg-gradient-to-br from-[#fdfaf3] via-[#f7f1e4] to-[#f1e8d6] text-[clamp(2rem,8vw,6rem)] font-bold text-white shadow-lg shadow-black/10 min-[1080px]:aspect-[1920/1080] min-[1080px]:max-w-[min(100%,calc((100vh_-_10rem_-_8px)*16/9))]">
              {/* On-brand blurred gradient blobs contained within the card. */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-[10%] top-[5%] size-[45%] rounded-full bg-[#b7aa7f]/60 blur-3xl" />
                <div className="absolute -right-[5%] top-[25%] size-[55%] rounded-full bg-[#d8c79b]/70 blur-3xl" />
                <div className="absolute bottom-[5%] left-[15%] size-[50%] rounded-full bg-[#e3d9bf]/70 blur-3xl" />
                <div className="absolute left-[45%] top-[55%] size-[40%] rounded-full bg-[#1f2b3b]/20 blur-3xl" />
              </div>
              {/* Semi-transparent blue glass overlay, like the one over the video. */}
              <div className="absolute inset-0 bg-[#1f2b3b]/50 backdrop-blur-2xl" />
              <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6 px-8 text-white">
                <h2
                  className={`text-center text-3xl font-medium leading-tight min-[1080px]:text-5xl ${rhymesDisplay.className}`}
                >
                  Let us know how we can <em>help</em>.
                </h2>
                <div className="flex w-full items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white shadow-lg shadow-black/10 backdrop-blur-md">
                  <svg
                    className="h-5 w-5 shrink-0 text-white/80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Ask us about anything..."
                    className="w-full bg-transparent text-base font-normal text-white placeholder:text-white/70 focus:outline-none"
                  />
                </div>

                <div className="hidden w-full flex-wrap items-center justify-center gap-3 min-[1080px]:flex">
                  <span className="text-base font-semibold text-white">
                    Need help with a:
                  </span>
                  {[
                    { icon: HeartHandshake, label: "Family Matter" },
                    { icon: Globe, label: "Immigration Matter" },
                    { icon: Scale, label: "Criminal Matter" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      type="button"
                      className="flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-normal text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
                    >
                      <Icon className="size-4 text-white/80" />
                      {label}
                    </button>
                  ))}
                </div>
                {/* <div className="flex w-full gap-4 mt-4">
              {QUESTIONS.map(({ title, desc }) => (
                <button
                  key={title}
                  type="button"
                  className="flex flex-1 cursor-pointer flex-col items-start gap-2 rounded-3xl border border-white/30 bg-white/10 p-5 text-left text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  <span className="text-sm font-semibold leading-snug">
                    {title}
                  </span>
                  <span className="text-xs font-normal leading-snug text-white/70">
                    {desc}
                  </span>
                </button>
              ))}
            </div> */}
                <button
                  type="button"
                  className="flex cursor-pointer flex-col items-center gap-1 text-sm font-normal text-white/70 transition-colors hover:text-white"
                >
                  I&apos;m looking for something else
                  <ChevronDown className="size-4" />
                </button>
              </div>
              <CardActions iconsOnly />
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
