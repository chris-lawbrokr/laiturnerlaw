"use client";

import { useState } from "react";
import localFont from "next/font/local";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";

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
          {/* <div className="absolute left-1/2 top-8 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#1f2b3b]/60 px-6 py-4 shadow-lg shadow-black/20 backdrop-blur-md">
            <img
              src="/images/logo.png"
              alt="Lai & Turner Law Firm PLLC — The People's Attorney"
              className="max-w-[130px]"
            />
          </div> */}
          <img
            src="/images/logo.png"
            alt="Lai & Turner Law Firm PLLC — The People's Attorney"
            className="absolute left-1/2 top-8 max-w-[150px] -translate-x-1/2"
          />
          <div className="absolute left-8 top-8 flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white shadow-lg shadow-black/10 backdrop-blur-md">
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
              placeholder="How can we help you today?"
              className="w-40 bg-transparent text-base font-normal text-white placeholder:text-white/70 focus:outline-none md:w-56"
            />
          </div>
          <a
            href="tel:+14055550199"
            className="absolute right-8 top-8 flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-base font-normal text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
          >
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
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            (405) 555-0199
          </a>
          <span
            className={`relative text-center text-[#e3d9bf] ${rhymesDisplay.className}`}
          >
            The People's Attorney
          </span>
          <div className="absolute bottom-8 left-8 max-w-[55%] text-left text-white">
            <p className="text-sm font-normal md:text-sm mb-4">
              <b>Top-Reviewed Lawyers Serving Oklahoma City</b>
            </p>
            <p className="mt-2 text-sm font-normal leading-tight max-w-[350px]">
              We’re different from other law firms in OKC. Younger, more
              innovative, and with the dynamic energy that your complex legal
              matter needs. We’re tough on the opposition and fiercely dedicated
              to your rights.
            </p>
          </div>
          <div className="absolute bottom-8 right-8 flex gap-4">
            <a
              href="tel:+14055550199"
              aria-label="Call us"
              className="flex size-24 flex-col items-center justify-center gap-1.5 rounded-3xl border border-[#1f2b3b]/40 bg-[#1f2b3b]/45 text-base font-medium text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-[#1f2b3b]/60"
            >
              <Phone className="size-6" />
              Call
            </a>
            <button
              type="button"
              className="group flex h-24 w-56 cursor-pointer items-center justify-between gap-3 rounded-3xl border border-[#b7aa7f]/50 bg-[#b7aa7f]/70 px-6 text-left text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-[#b7aa7f]/45"
            >
              <span className="text-xl font-medium leading-tight">
                Free Case
                <br />
                Evaluation
              </span>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#b7aa7f]/50 bg-[#b7aa7f]/80 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight className="size-5" />
              </span>
            </button>
            <button
              type="button"
              aria-label="Chat"
              className="flex size-24 cursor-pointer items-center justify-center rounded-3xl border border-white/30 bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <MessageCircle className="size-8" />
            </button>
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
