import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";

// The three CTA buttons (Call, Free Case Evaluation, Chat) pinned to the
// bottom-right of a card. Shared between the video card and the chat card.
export default function CardActions() {
  return (
    <div className="absolute bottom-8 right-8 z-10 flex gap-4">
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
  );
}
