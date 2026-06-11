"use client";

import { useState } from "react";
import { ChevronDown, Scale, HeartHandshake, Globe } from "lucide-react";
import VideoCard from "./video-card";
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
        <VideoCard />
        <div className="relative mt-8 mx-auto flex aspect-[1080/1920] w-full max-w-[min(100%,calc((100vh_-_4rem_-_8px)*9/16))] items-center justify-center overflow-hidden rounded-4xl border border-white/30 bg-gradient-to-br from-[#fdfaf3] via-[#f7f1e4] to-[#f1e8d6] text-[clamp(2rem,8vw,6rem)] font-bold text-white shadow-lg shadow-black/10 md:aspect-[1920/1080] md:max-w-[min(100%,calc((100vh_-_4rem_-_8px)*16/9))]">
          {/* On-brand blurred gradient blobs contained within the card. */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-[10%] top-[5%] size-[45%] rounded-full bg-[#b7aa7f]/60 blur-3xl" />
            <div className="absolute -right-[5%] top-[25%] size-[55%] rounded-full bg-[#d8c79b]/70 blur-3xl" />
            <div className="absolute bottom-[5%] left-[15%] size-[50%] rounded-full bg-[#e3d9bf]/70 blur-3xl" />
            <div className="absolute left-[45%] top-[55%] size-[40%] rounded-full bg-[#1f2b3b]/20 blur-3xl" />
          </div>
          {/* Semi-transparent blue glass overlay, like the one over the video. */}
          <div className="absolute inset-0 bg-[#1f2b3b]/10 backdrop-blur-2xl" />
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
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              Click our quick links below
            </p>
            <div className="flex w-full gap-4">
              {QUESTIONS.map(({ title, desc }) => (
                <button
                  key={title}
                  type="button"
                  className="flex flex-1 cursor-pointer flex-col items-start gap-3 rounded-3xl border border-white/30 bg-white/10 p-5 text-left text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  <span className="text-sm font-semibold leading-snug">
                    {title}
                  </span>
                  <span className="text-xs font-normal leading-snug text-white/70">
                    {desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <ChevronDown className="mt-[28vh] size-10 animate-bounce text-[#1f2b3b]/60" />
      </section>

      {/* Extra room so the user can scroll past the last card to trigger dismiss. */}
      <div className="h-[25vh]" aria-hidden />
    </div>
  );
}
