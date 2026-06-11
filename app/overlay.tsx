"use client";

import { useState } from "react";

// Scrollable intro: Title -> CTA -> Chat stacked as full-height sections.
// Scrolling past the last card fades the overlay out to reveal the homepage.
// Placeholder text for now so the frame flow can be verified.
const CARDS = [
  { key: "title", text: "Title" },
  { key: "chat", text: "Chat" },
];

export default function Overlay() {
  const [dismissed, setDismissed] = useState(false);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (dismissed) return;
    const el = e.currentTarget;
    // Dismiss once the user scrolls a bit past the last card.
    const lastCardTop = (CARDS.length - 1) * el.clientHeight;
    if (el.scrollTop > lastCardTop + el.clientHeight * 0.3) {
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
      {CARDS.map((card) => (
        <section
          key={card.key}
          className="flex min-h-screen w-full items-center justify-center px-8 py-8 md:px-24"
        >
          <div className="mx-auto border-4 flex aspect-[1080/1920] md:aspect-[1920/1080] w-full max-w-[min(100%,calc((100vh_-_4rem_-_8px)*9/16))] md:max-w-[min(100%,calc((100vh_-_4rem_-_8px)*16/9))] items-center justify-center text-[clamp(2rem,8vw,6rem)] font-bold text-[#111]">
            {card.text}
          </div>
        </section>
      ))}

      {/* Extra room so the user can scroll past the last card to trigger dismiss. */}
      <div className="h-screen" aria-hidden />
    </div>
  );
}
