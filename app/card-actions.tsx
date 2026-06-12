import { MessageCircle, Pencil, Phone, Search } from "lucide-react";

// The three icon square buttons (Call, Book, Ask AI), without any positioning
// wrapper, so they can be placed in different layouts. `withLabels` shows a
// title under each icon.
export function IconActions({
  withLabels = false,
  uniform = false,
  seamless = false,
  fluid = false,
  onAction,
}: {
  withLabels?: boolean;
  uniform?: boolean;
  seamless?: boolean;
  // `fluid` lets the three buttons grow to fill (flex-1) instead of a fixed
  // width, so they can spread evenly across a full-width bar.
  fluid?: boolean;
  onAction?: () => void;
}) {
  const sizing = withLabels
    ? `h-16 ${fluid ? "flex-1" : "w-20"} flex-col gap-1`
    : "size-16";
  const base = `flex ${sizing} cursor-pointer items-center justify-center rounded-2xl text-white transition-colors ${
    seamless ? "" : "shadow-lg shadow-black/10 backdrop-blur-md"
  }`;
  const label = "text-xs font-medium";

  // Brighter glass used for every button when `uniform` is set: higher white
  // tint, brighter border, and an inset top highlight for a glossy sheen.
  const glass =
    "border border-white/50 bg-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] hover:bg-white/35";
  // `seamless` drops each button's own background/border so the three sit
  // flush inside a single shared container, looking like one button.
  const seamlessStyle = "hover:bg-white/15";
  const callStyle = seamless
    ? seamlessStyle
    : uniform
    ? glass
    : "border border-[#1f2b3b]/40 bg-[#1f2b3b]/45 hover:bg-[#1f2b3b]/60";
  const bookStyle = seamless
    ? seamlessStyle
    : uniform
    ? glass
    : "border border-[#b7aa7f]/50 bg-[#b7aa7f]/70 hover:bg-[#b7aa7f]/45";
  const askStyle = seamless
    ? seamlessStyle
    : uniform
    ? glass
    : "border border-[#1f2b3b]/40 bg-[#1f2b3b]/45 hover:bg-[#1f2b3b]/60";

  return (
    <>
      <a
        href="tel:+14055550199"
        aria-label="Call us"
        onClick={
          onAction
            ? (e) => {
                e.preventDefault();
                onAction();
              }
            : undefined
        }
        className={`${base} ${callStyle}`}
      >
        <Phone className="size-6" />
        {withLabels && <span className={label}>Call</span>}
      </a>
      <button
        type="button"
        aria-label="Book a free case evaluation"
        onClick={onAction}
        className={`${base} ${bookStyle}`}
      >
        <Pencil className="size-6 -scale-x-100" />
        {withLabels && <span className={label}>Consult</span>}
      </button>
      <button
        type="button"
        aria-label="Ask AI"
        onClick={onAction}
        className={`${base} ${askStyle}`}
      >
        <Search className="size-6" />
        {withLabels && <span className={label}>Ask AI</span>}
      </button>
    </>
  );
}

// The CTA buttons (Call, Free Case Evaluation, Chat) pinned to the
// bottom-right of a card. Shared between the video card and the chat card.
// `iconsOnly` renders all three as compact icon-only squares.
export default function CardActions({
  iconsOnly = false,
}: {
  iconsOnly?: boolean;
}) {
  if (iconsOnly) {
    return (
      <>
        {/* Mobile: full-width centered bar with evenly spread buttons. */}
        <div className="absolute inset-x-6 bottom-6 z-10 flex gap-1 rounded-3xl border border-white/40 bg-white/20 p-2 shadow-lg shadow-black/20 backdrop-blur-md min-[1080px]:hidden">
          <IconActions withLabels uniform seamless fluid />
        </div>
        {/* Desktop: compact pill pinned bottom-right. */}
        <div className="absolute bottom-8 right-8 z-10 hidden gap-1 rounded-3xl border border-white/40 bg-white/20 p-2 shadow-lg shadow-black/20 backdrop-blur-md min-[1080px]:flex">
          <IconActions withLabels uniform seamless />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile: three even buttons spread across the bottom. */}
      <div className="absolute inset-x-6 bottom-6 z-10 flex gap-3 min-[1080px]:hidden">
        <a
          href="tel:+14055550199"
          aria-label="Call us"
          className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#1f2b3b]/40 bg-[#1f2b3b]/45 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-[#1f2b3b]/60"
        >
          <Phone className="size-5" />
          Call
        </a>
        <button
          type="button"
          className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#b7aa7f]/50 bg-[#b7aa7f]/70 py-3 text-center text-sm font-medium leading-tight text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-[#b7aa7f]/45"
        >
          <Pencil className="size-5 -scale-x-100" />
          Consult
        </button>
        <button
          type="button"
          className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/30 bg-white/10 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
        >
          <MessageCircle className="size-5" />
          Chat
        </button>
      </div>

      {/* Desktop: the original mixed-size CTA row, pinned bottom-right. */}
      <div className="absolute bottom-8 right-8 z-10 hidden gap-4 min-[1080px]:flex">
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
          className="group flex h-24 w-48 cursor-pointer items-center justify-between gap-3 rounded-3xl border border-[#b7aa7f]/50 bg-[#b7aa7f]/70 px-5 text-left text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-[#b7aa7f]/45"
        >
          <span className="text-xl font-medium leading-tight">
            Free Case
            <br />
            Evaluation
          </span>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#b7aa7f]/50 bg-[#b7aa7f]/80 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <Pencil className="size-4 -scale-x-100" />
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
    </>
  );
}
