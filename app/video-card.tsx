import { rhymesDisplay } from "./fonts";
import CardActions from "./card-actions";

// The hero video card: looping background video with the firm's branding,
// search, call link, supporting copy, and CTA buttons layered on top.
export default function VideoCard() {
  return (
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
      <div className="absolute right-8 top-8 flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-base font-normal text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
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
      <span
        className={`relative text-center text-[#e3d9bf] ${rhymesDisplay.className}`}
      >
        The People's Attorney
      </span>
      <div className="absolute bottom-8 left-8 max-w-[55%] text-left text-white">
        <p className="text-sm font-normal md:text-sm mb-4">
          <b>Top-Reviewed Lawyers Serving Oklahoma City</b>
        </p>
        <p className="mt-2 text-sm font-normal leading-tight max-w-[400px]">
          We’re different from other law firms in OKC. Younger, more innovative,
          and with the dynamic energy that your complex legal matter needs.
          We’re tough on the opposition and fiercely dedicated to your rights.
        </p>
      </div>
      <CardActions />
    </div>
  );
}
