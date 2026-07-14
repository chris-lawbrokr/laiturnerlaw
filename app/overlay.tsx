"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  Globe,
  Phone,
  Scale,
  X,
  type LucideIcon,
} from "lucide-react";
import { IconActions } from "./card-actions";
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

const TESTIMONIAL = {
  quote:
    "They treated my case like it was the only one that mattered. I never felt like just another file.",
  author: "Maria G., Oklahoma City",
  avatar: "/images/logo.png",
};

// ---- Overlay ---------------------------------------------------------------
// A single scrollable intro card. Scrolling past it — or pressing "Main site" —
// fades the overlay out to reveal the homepage.

const LAST_STEP = 0;

export default function Overlay() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [dismissed, setDismissed] = useState(false);
  // Once the fade-out finishes we fully remove the overlay (display:none) so it
  // no longer sits over the homepage.
  const [hidden, setHidden] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const lockedRef = useRef(false);
  const idleTimerRef = useRef<number | null>(null);

  // One gesture moves exactly one step (see prior notes) — here that means one
  // deliberate scroll dismisses the single card.
  const NEW_GESTURE = 6;
  const MOMENTUM_FLOOR = 4;
  const QUIET_MS = 80;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const advance = (dir: number) => {
      const next = stepRef.current + dir;
      if (next < 0) return;
      if (next > LAST_STEP) {
        setDismissed(true);
        return;
      }
      stepRef.current = next;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

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

  const dismiss = () => setDismissed(true);

  // Reopen the intro from the first tab.
  const reopen = () => {
    stepRef.current = 0;
    lockedRef.current = false;
    setActiveTab(TABS[0].id);
    setHidden(false);
    setDismissed(false);
  };

  const tab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <>
      <div
        ref={containerRef}
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
              <button
                type="button"
                aria-label="Close"
                onClick={dismiss}
                className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <X className="size-4" />
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

            {/* ---- Bottom bar (desktop): testimonial + info cards + Main site ---- */}
            <div className="absolute inset-x-8 bottom-8 z-10 hidden items-stretch gap-4 min-[1080px]:flex">
              {/* Testimonial */}
              <div className="flex h-28 flex-[1.7] items-center gap-4 rounded-3xl border border-white/25 bg-white/10 px-6 text-left shadow-lg shadow-black/10 backdrop-blur-md">
                <img
                  src={TESTIMONIAL.avatar}
                  alt=""
                  aria-hidden
                  className="size-12 shrink-0 rounded-full bg-white/90 object-contain p-1.5"
                />
                <div className="min-w-0">
                  <p className="line-clamp-3 text-sm font-normal leading-snug text-white">
                    “{TESTIMONIAL.quote}”
                  </p>
                  <span className="mt-1 block text-xs font-semibold text-white/70">
                    {TESTIMONIAL.author}
                  </span>
                </div>
              </div>

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

      {/* Floating quick-action buttons over the homepage, once the intro is gone. */}
      {dismissed && (
        <>
          <div className="fixed inset-x-6 bottom-6 z-[10000] flex gap-1 rounded-3xl border border-[#1f2b3b]/50 bg-[#1f2b3b]/55 p-2 shadow-lg shadow-black/20 backdrop-blur-md min-[1080px]:hidden">
            <IconActions withLabels uniform seamless fluid onAction={reopen} />
          </div>
          <div className="fixed bottom-8 left-8 z-[10000] hidden gap-1 rounded-3xl border border-[#1f2b3b]/50 bg-[#1f2b3b]/55 p-2 shadow-lg shadow-black/20 backdrop-blur-md min-[1080px]:flex">
            <IconActions withLabels uniform seamless onAction={reopen} />
          </div>
        </>
      )}
    </>
  );
}
