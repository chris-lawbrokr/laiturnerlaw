"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  Globe,
  LayoutDashboard,
  Phone,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { rhymesDisplay } from "./fonts";

// ---- Card content ----------------------------------------------------------
// Ported from the Boxii "multi-tab" layout: a top-center tab bar swaps the hero
// (headline / subhead / chips / CTA), and a shared bottom bar shows a
// testimonial alongside a couple of info cards and a "Main site" button.

type Chip = { icon: LucideIcon; label: string };

type Tab = {
  id: string;
  label: string;
  // The headline may highlight part of itself in the brand beige.
  headline: React.ReactNode;
  subhead: string;
  chips?: Chip[];
  cta: string;
};

const TABS: Tab[] = [
  {
    id: "new",
    label: "New here",
    headline: (
      <>
        The People&apos;s <span className="text-[#e3d9bf]">Attorney</span>
      </>
    ),
    subhead:
      "Top-reviewed lawyers serving Oklahoma City. Tough on the opposition, fiercely dedicated to your rights.",
    chips: [
      { icon: HeartHandshake, label: "Family Matter" },
      { icon: Globe, label: "Immigration Matter" },
      { icon: Scale, label: "Criminal Matter" },
    ],
    cta: "Get a free case evaluation",
  },
  {
    id: "practice",
    label: "Practice areas",
    headline: (
      <>
        How can we <span className="text-[#e3d9bf]">help</span>?
      </>
    ),
    subhead:
      "Criminal defense, immigration, and family law representation for the people of Oklahoma City.",
    chips: [
      { icon: Scale, label: "Criminal Defense" },
      { icon: Globe, label: "Immigration" },
      { icon: HeartHandshake, label: "Family Law" },
    ],
    cta: "Explore practice areas",
  },
  {
    id: "firm",
    label: "Our firm",
    headline: (
      <>
        Meet <span className="text-[#e3d9bf]">our team</span>.
      </>
    ),
    subhead:
      "Younger, more innovative, and with the dynamic energy your complex legal matter needs.",
    cta: "Meet the attorneys",
  },
];

type InfoCard = { label: string; title: string; cta: string };

const INFO_CARDS: InfoCard[] = [
  {
    label: "Case Result",
    title: "Felony charges dismissed in under 30 days",
    cta: "Read the story",
  },
  {
    label: "From the Blog",
    title: "What to do right after an arrest in OKC",
    cta: "Read the blog",
  },
];

// ---- Overlay ---------------------------------------------------------------
// A single scrollable intro card. Scrolling past it — or pressing "Main site" —
// fades the overlay out to reveal the homepage.

export default function Overlay() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [dismissed, setDismissed] = useState(false);
  // Once the fade-out finishes we fully remove the overlay (display:none) so it
  // no longer sits over the homepage.
  const [hidden, setHidden] = useState(false);

  // Escape closes the overlay (matching Boxii); dismissal is otherwise driven by
  // the "Main site" button — there is no scroll/swipe-to-dismiss.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDismissed(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const dismiss = () => setDismissed(true);

  // Reopen the intro from the first tab.
  const reopen = () => {
    setActiveTab(TABS[0].id);
    setHidden(false);
    setDismissed(false);
  };

  const tab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <>
      <div
        onTransitionEnd={(e) => {
          if (dismissed && e.target === e.currentTarget) setHidden(true);
        }}
        className={`fixed inset-0 z-[9999] overflow-hidden bg-white transition-opacity duration-[700ms] ease-in-out ${
          hidden ? "hidden" : ""
        } ${dismissed ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <div className="flex h-full w-full items-center justify-center px-4 py-4 min-[1080px]:px-12 min-[1080px]:py-10">
          {/* The card shell: video background + navy glass, sized to a portrait
              frame on mobile and a landscape frame on desktop. */}
          <div className="relative mx-auto flex aspect-[1080/1920] w-full max-w-[min(100%,calc((100vh_-_4rem)*9/16))] items-center justify-center overflow-hidden rounded-4xl text-white shadow-xl shadow-black/20 min-[1080px]:aspect-[1920/1080] min-[1080px]:max-w-[min(100%,calc((100vh_-_5rem)*16/9))]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/bg.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-[#1f2b3b]/50 backdrop-blur-md" />

            {/* ---- Header: wordmark, tabs, top-right controls ---- */}
            <img
              src="/images/logo.png"
              alt="Lai & Turner Law Firm PLLC"
              className="absolute left-8 top-8 z-20 hidden h-10 object-contain object-left min-[1080px]:block"
            />

            {/* Top-center tabs. Scrolls horizontally if it can't fit. */}
            <div className="absolute left-1/2 top-5 z-20 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md min-[1080px]:top-8">
              {TABS.map((t) => {
                const active = t.id === activeTab;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(t.id)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-white text-[#1f2b3b]"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop top-right: Call, primary CTA, close. */}
            <div className="absolute right-8 top-8 z-20 hidden items-center gap-3 min-[1080px]:flex">
              <a
                href="tel:+14055550199"
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-normal text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <Phone className="size-4 text-white/80" />
                Call us
              </a>
              <button
                type="button"
                className="rounded-full bg-[#b7aa7f] px-5 py-2.5 text-sm font-semibold text-[#1f2b3b] shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-[#c7ba8f]"
              >
                Free consultation
              </button>
            </div>

            {/* ---- Hero: swaps with the active tab ---- */}
            <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
              <div
                key={activeTab}
                className="hero-fade flex w-full max-w-2xl flex-col items-center gap-5 text-center"
              >
                <h2
                  className={`text-[clamp(2rem,7vw,3.75rem)] font-medium leading-[1.08] ${rhymesDisplay.className}`}
                >
                  {tab.headline}
                </h2>
                <p className="max-w-lg text-base font-normal leading-relaxed text-white/80">
                  {tab.subhead}
                </p>
                {tab.chips && (
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {tab.chips.map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        type="button"
                        className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-normal text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
                      >
                        <Icon className="size-4 text-white/80" />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="mt-1 flex items-center gap-2 rounded-xl bg-[#b7aa7f] px-6 py-3 text-base font-semibold text-[#1f2b3b] shadow-lg shadow-black/10 transition-colors hover:bg-[#c7ba8f]"
                >
                  {tab.cta}
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>

            {/* ---- Bottom bar (desktop): info cards + Main site ---- */}
            <div className="absolute inset-x-8 bottom-8 z-10 hidden items-stretch gap-4 min-[1080px]:flex">
              {/* Info cards */}
              {INFO_CARDS.map((c) => (
                <button
                  key={c.title}
                  type="button"
                  className="flex h-28 flex-1 flex-col justify-center gap-1 overflow-hidden rounded-3xl border border-white/25 bg-white/10 px-5 text-left shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                    {c.label}
                  </span>
                  <span className="line-clamp-2 text-[17px] font-medium leading-tight text-white">
                    {c.title}
                  </span>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-[#e3d9bf]">
                    {c.cta}
                    <ArrowRight className="size-3" />
                  </span>
                </button>
              ))}

              {/* Main site */}
              <button
                type="button"
                onClick={dismiss}
                className="flex h-28 w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-3xl border border-white/25 bg-white/10 text-sm font-medium text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <ArrowUpRight className="size-5" />
                Main site
              </button>
            </div>

            {/* ---- Bottom bar (mobile): Main site + primary CTA ---- */}
            <div className="absolute inset-x-6 bottom-6 z-10 flex gap-3 min-[1080px]:hidden">
              <button
                type="button"
                onClick={dismiss}
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-white/30 bg-white/10 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <ArrowUpRight className="size-5" />
                Main site
              </button>
              <button
                type="button"
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl bg-[#b7aa7f] py-3 text-sm font-semibold text-[#1f2b3b] shadow-lg shadow-black/10 transition-colors hover:bg-[#c7ba8f]"
              >
                <Phone className="size-5" />
                Free consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsed "mini Boxii" launcher over the homepage, once the intro is gone:
          a single circular FAB that toggles a small link menu. */}
      {dismissed && <MiniLauncher onReopen={reopen} />}
    </>
  );
}

// The floating launcher shown after the overlay is dismissed. A circular FAB
// pinned bottom-left toggles a small popup list (CTAs + reopen), mirroring the
// Boxii launcher. Closes on outside-click or Escape.
function MiniLauncher({ onReopen }: { onReopen: () => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (
        open &&
        rootRef.current &&
        !rootRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (open && e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const item =
    "flex w-full items-center px-4 py-3 text-left text-sm font-medium text-white no-underline transition-colors hover:bg-white/10";

  return (
    <div
      ref={rootRef}
      className="fixed bottom-6 left-6 z-[10000] flex flex-col items-start gap-2.5 min-[1080px]:bottom-8 min-[1080px]:left-8"
    >
      {open && (
        <div
          role="menu"
          className="hero-fade flex min-w-[220px] flex-col divide-y divide-white/10 overflow-hidden rounded-2xl border border-[#1f2b3b]/50 bg-[#1f2b3b]/70 shadow-lg shadow-black/25 backdrop-blur-md"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={item}
          >
            Free consultation
          </button>
          <a
            role="menuitem"
            href="tel:+14055550199"
            onClick={() => setOpen(false)}
            className={item}
          >
            Call (405) 555-0199
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onReopen();
            }}
            className={item}
          >
            Site Navigation
          </button>
        </div>
      )}
      <button
        type="button"
        aria-label="Open menu"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-14 items-center justify-center rounded-full border border-[#1f2b3b]/50 bg-[#1f2b3b]/60 text-white shadow-lg shadow-black/25 backdrop-blur-md transition-transform hover:-translate-y-0.5"
      >
        <LayoutDashboard className="size-6" />
      </button>
    </div>
  );
}
