"use client";

import { useState } from "react";
import localFont from "next/font/local";

// Self-hosted display font for the headline.
const rhymesDisplay = localFont({
  src: "../public/fonts/Rhymes Display Medium.woff2",
  display: "swap",
});

// Scrollable intro: stacked full-height cards. Scrolling past the last card
// fades the overlay out to reveal the homepage. Placeholder text for now so
// the frame flow can be verified.

export default function Overlay() {
  const [dismissed, setDismissed] = useState(false);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (dismissed) return;
    const el = e.currentTarget;
    // Dismiss once scrolled (almost) to the bottom — i.e. past the last card.
    // The trailing spacer gives the room needed to reach the bottom.
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
      setDismissed(true);
    }
  };

  return (
    <div
      onScroll={onScroll}
      className={`fixed inset-0 z-[9999] bg-white transition-opacity duration-[600ms] ease-in-out ${
        dismissed
          ? "pointer-events-none overflow-hidden opacity-0"
          : "overflow-y-auto opacity-100"
      }`}
    >
      <section className="flex w-full flex-col items-center px-8 py-8 md:px-24">
        <div className="relative mx-auto flex aspect-[1080/1920] w-full max-w-[min(100%,calc((100vh_-_4rem_-_8px)*9/16))] items-center justify-center overflow-hidden rounded-4xl text-[clamp(2rem,8vw,6rem)] font-bold text-[#111] md:aspect-[1920/1080] md:max-w-[min(100%,calc((100vh_-_4rem_-_8px)*16/9))]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/bg.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <span
            className={`relative text-center text-white ${rhymesDisplay.className}`}
          >
            The People's Attorney
          </span>
          <div className="absolute bottom-8 left-8 max-w-[55%] text-left text-white">
            <p className="text-xs font-normal md:text-sm">
              Top-Reviewed Lawyers Serving Oklahoma City
            </p>
            <p className="mt-2 text-lg font-normal leading-tight md:text-2xl">
              Criminal Defense, Immigration and
              <br /> Family Law Attorneys in Oklahoma City
            </p>
          </div>
        </div>
        <div className="mt-8 mx-auto flex aspect-[1080/1920] w-full max-w-[min(100%,calc((100vh_-_4rem_-_8px)*9/16))] items-center justify-center border-4 text-[clamp(2rem,8vw,6rem)] font-bold text-[#111] md:aspect-[1920/1080] md:max-w-[min(100%,calc((100vh_-_4rem_-_8px)*16/9))]">
          CTA
        </div>
      </section>

      {/* Extra room so the user can scroll past the last card to trigger dismiss. */}
      <div className="h-[25vh]" aria-hidden />
    </div>
  );
}
