import { rhymesDisplay } from "./fonts";
import CardActions from "./card-actions";
import CallCtaMenu from "./call-cta-menu";

// The hero video card: looping background video with the firm's branding,
// search, call link, supporting copy, and CTA buttons layered on top.
export default function VideoCard() {
  return (
    <div className="relative mx-auto flex aspect-[1080/1920] w-full max-w-[min(100%,calc((100vh_-_10rem_-_8px)*9/16))] items-center justify-center overflow-hidden rounded-4xl text-[clamp(2rem,8vw,6rem)] font-bold text-[#111] min-[1080px]:aspect-[1920/1080] min-[1080px]:max-w-[min(100%,calc((100vh_-_10rem_-_8px)*16/9))]">
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
      {/* Hidden on mobile so the search bar can own the top row. */}
      <img
        src="/images/logo.png"
        alt="Lai & Turner Law Firm PLLC — The People's Attorney"
        className="absolute left-1/2 top-8 hidden max-w-[150px] -translate-x-1/2 min-[1080px]:block"
      />
      <div className="absolute left-6 right-20 top-6 flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white shadow-lg shadow-black/10 backdrop-blur-md min-[1080px]:left-8 min-[1080px]:right-auto min-[1080px]:top-8">
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
        {/* Mobile uses a shorter placeholder so it never clips at the call button. */}
        <input
          type="text"
          placeholder="How can we help"
          className="w-full bg-transparent text-base font-normal text-white placeholder:text-white/70 focus:outline-none min-[1080px]:hidden"
        />
        <input
          type="text"
          placeholder="How can we help you today?"
          className="hidden w-full bg-transparent text-base font-normal text-white placeholder:text-white/70 focus:outline-none min-[1080px]:block min-[1080px]:w-56"
        />
      </div>
      {/* Desktop: full call + CTA pills. Mobile: a single circular dropdown. */}
      <div className="absolute right-6 top-6 hidden items-center gap-3 min-[1080px]:right-8 min-[1080px]:top-8 min-[1080px]:flex">
        <button
          type="button"
          className="hidden items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-base font-normal text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20 min-[1200px]:flex"
        >
          Free Case Evaluation
        </button>
        <a
          href="tel:+14055550199"
          className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-base font-normal text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
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
      </div>
      <div className="absolute right-6 top-6 min-[1080px]:hidden">
        <CallCtaMenu />
      </div>
      <span
        className={`relative px-10 text-center text-[clamp(2.25rem,11vw,3.5rem)] leading-[1.1] text-[#e3d9bf] min-[1080px]:px-0 min-[1080px]:text-[clamp(2rem,8vw,6rem)] ${rhymesDisplay.className}`}
      >
        The People's
        <br className="min-[1080px]:hidden" /> Attorney
      </span>
      {/* Supporting copy is desktop-only; the mobile card stays uncluttered. */}
      <div className="absolute bottom-8 left-8 hidden max-w-[55%] text-left text-white min-[1080px]:block">
        <p className="mb-4 text-sm font-normal">
          <b>Top-Reviewed Lawyers Serving Oklahoma City</b>
        </p>
        <p className="mt-2 max-w-[400px] text-sm font-normal leading-tight">
          We’re different from other law firms in OKC. Younger, more innovative,
          and with the dynamic energy that your complex legal matter needs.
          We’re tough on the opposition and fiercely dedicated to your rights.
        </p>
      </div>
      <CardActions />
    </div>
  );
}
