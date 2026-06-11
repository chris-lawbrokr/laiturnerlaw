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

export default function Overlay() {
  const [dismissed, setDismissed] = useState(false);
  // 0 = first card fully shown, 1 = second card fully shown. Drives the
  // scroll-linked crossfade between the two stacked cards.
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (dismissed) return;
    const el = e.currentTarget;
    // Map the first viewport-height of scrolling to the 0→1 crossfade.
    setProgress(el.scrollTop / el.clientHeight);
    // Dismiss once scrolled (almost) to the bottom — i.e. past the last card.
    // The trailing scroll track gives the room needed to reach the bottom.
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
      setDismissed(true);
    }
  };

  // Reopen the intro and start it back at the top.
  const reopen = () => setDismissed(false);

  // Whenever the overlay is (re)opened, reset its scroll position to the top so
  // it doesn't immediately re-trigger the bottom-of-scroll dismiss.
  useEffect(() => {
    if (!dismissed && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setProgress(0);
    }
  }, [dismissed]);

  return (
    <>
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className={`fixed inset-0 z-[9999] bg-white transition-opacity duration-[600ms] ease-in-out ${
        dismissed
          ? "pointer-events-none overflow-hidden opacity-0"
          : "overflow-y-auto opacity-100"
      }`}
    >
      {/* Scroll track: tall enough to drive the crossfade, then the dismiss. */}
      <div className="relative h-[300vh]">
        <div className="sticky top-0 h-screen w-full">
          <div className="relative h-full w-full">
            {/* First card — fades out as you scroll. */}
            <div
              className="absolute inset-0 flex items-center justify-center px-8 py-8 md:px-24"
              style={{
                opacity: Math.min(Math.max(1 - progress, 0), 1),
                pointerEvents: progress > 0.5 ? "none" : "auto",
              }}
            >
              <VideoCard />
            </div>
            {/* Second card — crossfades in over the first. */}
            <div
              className="absolute inset-0 flex items-center justify-center px-8 py-8 md:px-24"
              style={{
                opacity: Math.min(Math.max(progress, 0), 1),
                pointerEvents: progress > 0.5 ? "auto" : "none",
              }}
            >
        <div className="relative mx-auto flex aspect-[1080/1920] w-full max-w-[min(100%,calc((100vh_-_4rem_-_8px)*9/16))] items-center justify-center overflow-hidden rounded-4xl border border-white/30 bg-gradient-to-br from-[#fdfaf3] via-[#f7f1e4] to-[#f1e8d6] text-[clamp(2rem,8vw,6rem)] font-bold text-white shadow-lg shadow-black/10 md:aspect-[1920/1080] md:max-w-[min(100%,calc((100vh_-_4rem_-_8px)*16/9))]">
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
              className={`text-center text-3xl font-medium leading-tight md:text-5xl ${rhymesDisplay.className}`}
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

            <div className="flex w-full flex-wrap items-center justify-center gap-3">
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
            {/* Scroll hint — fades out as the crossfade begins. */}
            <ChevronDown
              className="absolute bottom-6 left-1/2 -translate-x-1/2 size-10 animate-bounce text-white/70"
              style={{ opacity: Math.min(Math.max(1 - progress * 2, 0), 1) }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Floating quick-action buttons over the homepage, once the intro is gone. */}
    {dismissed && (
      <div className="fixed bottom-8 left-8 z-[10000] flex gap-1 rounded-3xl border border-[#1f2b3b]/50 bg-[#1f2b3b]/55 p-2 shadow-lg shadow-black/20 backdrop-blur-md">
        <IconActions withLabels uniform seamless onAction={reopen} />
      </div>
    )}
    </>
  );
}
