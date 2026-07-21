"use client";

type Props = {
  progress: number;
  visible: boolean;
};

export default function PageLoader({ progress, visible }: Props) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-void"
      role="status"
      aria-live="polite"
      aria-label={`Loading ${progress}%`}
    >
      <p className="font-display text-caption uppercase tracking-[0.25em] text-chrome-dim">
        Loading sequence
      </p>
      <p className="mt-4 font-display text-5xl tabular-nums tracking-tight text-chrome sm:text-6xl">
        {String(progress).padStart(3, "0")}
        <span className="text-2xl text-chrome-dim">%</span>
      </p>
      <div className="mt-8 h-px w-48 overflow-hidden bg-[rgba(232,236,242,0.12)]">
        <div
          className="h-full bg-gradient-to-r from-cobalt to-sky transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
