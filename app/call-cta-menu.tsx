"use client";

import { useState } from "react";
import { Pencil, Phone } from "lucide-react";

// Mobile-only circular dropdown that collapses the video card's top-right
// "Free Case Evaluation" + call links into one tappable circle, so they no
// longer overflow the narrow portrait card.
export default function CallCtaMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Contact options"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
      >
        <Phone className="size-5 text-white/90" />
      </button>

      {open && (
        <>
          {/* Tap anywhere else to close. */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-0 cursor-default"
          />
          <div className="absolute right-0 top-full z-10 mt-2 flex w-56 flex-col gap-1 rounded-2xl border border-white/30 bg-white/10 p-2 text-white shadow-lg shadow-black/10 backdrop-blur-md">
            <a
              href="tel:+14055550199"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-normal transition-colors hover:bg-white/15"
            >
              <Phone className="size-4 text-white/80" />
              (405) 555-0199
            </a>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-normal transition-colors hover:bg-white/15"
            >
              <Pencil className="size-4 -scale-x-100 text-white/80" />
              Free Case Evaluation
            </button>
          </div>
        </>
      )}
    </div>
  );
}
