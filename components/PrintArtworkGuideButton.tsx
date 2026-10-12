"use client";

export default function PrintArtworkGuideButton() {
  return (
    <button
      type="button"
      onClick={() =>
        window.print()
      }
      className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/10 print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
