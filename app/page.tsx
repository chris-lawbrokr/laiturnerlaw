import { readFileSync } from "node:fs";
import { join } from "node:path";
import ClonedSite from "./cloned-site";
import Overlay from "./overlay";

// Self-contained snapshot of the live homepage, captured by scripts/clone.mjs.
const html = readFileSync(join(process.cwd(), "public", "clone.html"), "utf-8");

export default function Home() {
  return (
    <>
      <ClonedSite html={html} title="Lai & Turner Law Firm PLLC" />
      <Overlay />
    </>
  );
}
