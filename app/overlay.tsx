"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  Globe,
  LayoutDashboard,
  Menu,
  Phone,
  Scale,
  X,
  type LucideIcon,
} from "lucide-react";
import { rhymesDisplay } from "./fonts";

// ---- Card content ----------------------------------------------------------
// Ported from the Boxii "multi-tab" layout: a top-center tab bar swaps the hero
// (headline / subhead / chips / CTA), and a shared bottom bar shows a
// testimonial alongside a couple of info cards and a "Main site" button.

type Chip = {
  icon: LucideIcon;
  label: string;
  // When a chip carries a title/body it opens an answer popup (with a "Learn
  // More" link) instead of routing to a link.
  title?: string;
  body?: string;
  learnMore?: string;
  // A plain link chip (no popup). Defaults to the intake flow when omitted.
  href?: string;
};

type Tab = {
  id: string;
  label: string;
  // The headline may highlight part of itself in the brand beige.
  headline: React.ReactNode;
  subhead: string;
  chips?: Chip[];
  cta: string;
  // Where the hero CTA points. Defaults to the Lawbrokr intake flow (CTA_URL).
  ctaHref?: string;
};

const TABS: Tab[] = [
  {
    id: "new",
    label: "Home",
    headline: (
      <>
        The People&apos;s <span className="text-[#e3d9bf]">Attorney</span>
      </>
    ),
    subhead:
      "Top-reviewed lawyers serving Oklahoma City. Tough on the opposition, fiercely dedicated to your rights.",
    chips: [
      {
        icon: Scale,
        label: "Criminal Defense",
        title: "Criminal Defense",
        body: "Criminal defense lawyers represent individuals who have been arrested, charged with a crime, or who are under investigation by the police. Our criminal defense attorneys protect your rights, build a strong defense, and negotiate a positive outcome with the prosecutor.",
        learnMore: "https://www.laiturnerlaw.com/criminal-defense/",
      },
      {
        icon: HeartHandshake,
        label: "Family Law",
        title: "Family Law",
        body: "Family law encompasses the legal aspects of relationships, including child custody, divorce, grandparents' rights, and adoption. Our lawyers can represent you as you change your legal obligations to another person or revise an existing court order (such as a child support modification).",
        learnMore: "https://www.laiturnerlaw.com/family-law/",
      },
      {
        icon: Globe,
        label: "Immigration",
        title: "Immigration",
        body: "Immigration law deals with the rights of people to enter the U.S. for vacations, to live, and to work. It sets conditions for people to emigrate to the country and conditions by which people are deported. Our immigration lawyer helps with visas, green cards, citizenship, asylum, and deportation defense.",
        learnMore: "https://www.laiturnerlaw.com/immigration/",
      },
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
      {
        icon: Scale,
        label: "Criminal Defense",
        title: "Criminal Defense",
        body: "Criminal defense lawyers represent individuals who have been arrested, charged with a crime, or who are under investigation by the police. Our criminal defense attorneys protect your rights, build a strong defense, and negotiate a positive outcome with the prosecutor.",
        learnMore: "https://www.laiturnerlaw.com/criminal-defense/",
      },
      {
        icon: Globe,
        label: "Immigration",
        title: "Immigration Law",
        body: "Immigration law deals with the rights of people to enter the U.S. for vacations, to live, and to work. It sets conditions for people to emigrate to the country and conditions by which people are deported. Our immigration lawyer helps with visas, green cards, citizenship, asylum, and deportation defense.",
        learnMore: "https://www.laiturnerlaw.com/immigration/",
      },
      {
        icon: HeartHandshake,
        label: "Family Law",
        title: "Family Law",
        body: "Family law encompasses the legal aspects of relationships, including child custody, divorce, grandparents' rights, and adoption. Our lawyers can represent you as you change your legal obligations to another person or revise an existing court order (such as a child support modification).",
        learnMore: "https://www.laiturnerlaw.com/family-law/",
      },
    ],
    cta: "Explore practice areas",
    ctaHref: "https://www.laiturnerlaw.com/areas-of-practice/",
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
    ctaHref: "https://www.laiturnerlaw.com/our-team/",
  },
];

type InfoCard = {
  label: string;
  title: React.ReactNode;
  cta: string;
  href?: string;
};

const INFO_CARDS: InfoCard[] = [
  {
    label: "From the Blog",
    title: (
      <>
        Divorce Preparation Checklist:
        <br />
        What to Gather, Plan, and Avoid
      </>
    ),
    cta: "Read the blog",
    href: "https://www.laiturnerlaw.com/divorce-preparation-checklist-what-to-gather-plan-and-avoid/",
  },
  {
    label: "From the Blog",
    title: (
      <>
        Who Pays Attorney Fees in Divorce?
        <br />
        Clear Legal Rules + Cost Breakdown
      </>
    ),
    cta: "Read the blog",
    href: "https://www.laiturnerlaw.com/who-pays-attorney-fees-in-divorce-clear-legal-rules-cost-breakdown/",
  },
];

// Every conversion CTA (hero button, chips, info cards, "Free consultation")
// routes to the firm's Lawbrokr intake flow.
const CTA_URL =
  "https://laiturnerlaw.lawbrokr.com/?utm_source=google&utm_medium=organic&landed_url=https%3A%2F%2Fwww.laiturnerlaw.com%2F&engaged_url=https%3A%2F%2Fwww.laiturnerlaw.com%2F";

// ---- Overlay ---------------------------------------------------------------
// A single scrollable intro card. Scrolling past it — or pressing "Main site" —
// fades the overlay out to reveal the homepage.

export default function Overlay() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [dismissed, setDismissed] = useState(false);
  // Once the fade-out finishes we fully remove the overlay (display:none) so it
  // no longer sits over the homepage.
  const [hidden, setHidden] = useState(false);
  // The practice-area chip whose answer popup is open (null = none).
  const [openChip, setOpenChip] = useState<Chip | null>(null);
  // The mobile hamburger menu (tabs + CTAs) open state.
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Escape closes the chip popup, then the mobile menu, then the overlay
  // (matching Boxii); dismissal is otherwise driven by the "Main site" button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openChip) setOpenChip(null);
      else if (menuOpen) setMenuOpen(false);
      else setDismissed(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openChip, menuOpen]);

  // Close the mobile menu on any click outside it.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, [menuOpen]);

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
              className="absolute left-6 top-6 z-20 h-10 object-contain object-left min-[1080px]:left-8 min-[1080px]:top-8 min-[1080px]:h-14"
            />

            {/* Top-center tabs (desktop). On mobile these live in the menu. */}
            <div className="absolute left-1/2 top-5 z-20 hidden max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md min-[1080px]:top-8 min-[1080px]:flex">
              {TABS.map((t) => {
                const active = t.id === activeTab;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setActiveTab(t.id);
                      setOpenChip(null);
                    }}
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
                href="tel:+14052517155"
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-normal text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <Phone className="size-4 text-white/80" />
                Call us
              </a>
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#b7aa7f] px-5 py-2.5 text-sm font-semibold text-[#1f2b3b] shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-[#c7ba8f]"
              >
                Free consultation
              </a>
            </div>

            {/* Mobile: hamburger that toggles a full-width menu of tabs + CTAs. */}
            <div ref={menuRef} className="min-[1080px]:hidden">
              <button
                type="button"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="absolute right-6 top-6 z-30 flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
              >
                {menuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>
              {/* Kept mounted so it can transition both in AND out. */}
              <div
                className={`absolute inset-x-6 top-[4.75rem] z-30 flex origin-top flex-col gap-1 rounded-2xl border border-white/40 bg-white/20 p-2 shadow-xl shadow-black/30 backdrop-blur-2xl transition-[opacity,transform] duration-200 ease-out ${
                  menuOpen
                    ? "translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-2 scale-95 opacity-0"
                }`}
              >
                {TABS.map((t) => {
                  const active = t.id === activeTab;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(t.id);
                        setOpenChip(null);
                        setMenuOpen(false);
                      }}
                      className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        active
                          ? "bg-white/30 text-white"
                          : "text-white/85 hover:bg-white/15"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
                <div className="my-1 h-px bg-white/25" />
                <a
                  href="tel:+14052517155"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/85 no-underline transition-colors hover:bg-white/15"
                >
                  <Phone className="size-4" />
                  Call us
                </a>
                <a
                  href={CTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="mt-0.5 flex items-center justify-center rounded-xl bg-[#b7aa7f] px-3 py-2.5 text-sm font-semibold text-[#1f2b3b] no-underline transition-colors hover:bg-[#c7ba8f]"
                >
                  Free consultation
                </a>
              </div>
            </div>

            {/* ---- Hero: swaps with the active tab ---- */}
            {/* Extra bottom padding optically centers the hero within the gap
                between the header and the taller bottom bar, rather than the
                full card. */}
            <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pb-16 min-[1080px]:pb-[72px]">
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
                    {tab.chips.map((chip) => {
                      const Icon = chip.icon;
                      const cls =
                        "flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-normal text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20";
                      // Chips with body copy open an answer popup; the rest route
                      // straight to the intake flow.
                      return chip.body ? (
                        <button
                          key={chip.label}
                          type="button"
                          onClick={() => setOpenChip(chip)}
                          className={cls}
                        >
                          <Icon className="size-4 text-white/80" />
                          {chip.label}
                        </button>
                      ) : (
                        <a
                          key={chip.label}
                          href={chip.href ?? CTA_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cls}
                        >
                          <Icon className="size-4 text-white/80" />
                          {chip.label}
                        </a>
                      );
                    })}
                  </div>
                )}
                <a
                  href={tab.ctaHref ?? CTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-2 rounded-xl bg-[#b7aa7f] px-6 py-3 text-base font-semibold text-[#1f2b3b] shadow-lg shadow-black/10 transition-colors hover:bg-[#c7ba8f]"
                >
                  {tab.cta}
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>

            {/* ---- Bottom bar (desktop): info cards + Main site ---- */}
            <div className="absolute inset-x-8 bottom-8 z-10 hidden items-stretch gap-4 min-[1080px]:flex">
              {/* Info cards */}
              {INFO_CARDS.map((c) => (
                <a
                  key={c.href ?? c.cta}
                  href={c.href ?? CTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-28 flex-1 flex-col justify-center gap-1 overflow-hidden rounded-3xl border border-white/25 bg-white/10 px-5 text-left shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  <span className="line-clamp-2 min-h-[2lh] text-lg font-medium leading-snug text-white">
                    {c.title}
                  </span>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-[#e3d9bf]">
                    {c.cta}
                    <ArrowRight className="size-3" />
                  </span>
                </a>
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
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl bg-[#b7aa7f] py-3 text-sm font-semibold text-[#1f2b3b] shadow-lg shadow-black/10 transition-colors hover:bg-[#c7ba8f]"
              >
                <Phone className="size-5" />
                Free consultation
              </a>
            </div>

            {/* ---- Chip answer popup (practice-area details) ---- */}
            {openChip && (
              <div className="absolute inset-0 z-30 flex items-center justify-center p-6">
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpenChip(null)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />
                <div className="hero-fade relative z-10 w-full max-w-2xl rounded-3xl border border-white/40 bg-white/20 p-8 text-left shadow-xl shadow-black/30 backdrop-blur-2xl min-[1080px]:p-10">
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOpenChip(null)}
                    className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <X className="size-4" />
                  </button>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                    Practice Area
                  </span>
                  <h3
                    className={`mt-1 text-2xl font-medium leading-tight text-white ${rhymesDisplay.className}`}
                  >
                    {openChip.title}
                  </h3>
                  <p className="mt-3 text-sm font-normal leading-relaxed text-white/80">
                    {openChip.body}
                  </p>
                  {openChip.learnMore && (
                    <a
                      href={openChip.learnMore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-[#b7aa7f] px-5 py-2.5 text-sm font-semibold text-[#1f2b3b] transition-colors hover:bg-[#c7ba8f]"
                    >
                      Learn More
                      <ArrowRight className="size-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
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
          <a
            role="menuitem"
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={item}
          >
            Free consultation
          </a>
          <a
            role="menuitem"
            href="tel:+14052517155"
            onClick={() => setOpen(false)}
            className={item}
          >
            Call (405) 251-7155
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
