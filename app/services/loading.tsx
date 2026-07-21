export default function ServicesLoading() {
  return (
    <main
      id="main"
      className="grid min-h-svh place-items-center bg-night px-5 text-white"
      aria-busy="true"
      aria-label="Loading services"
    >
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.1em] text-fog">
          <span>Digi Clicks</span>
          <span>Connecting service readouts</span>
        </div>
        <div className="mt-4 h-px overflow-hidden bg-white/15">
          <span className="block h-full w-1/2 animate-pulse bg-mint motion-reduce:animate-none" />
        </div>
      </div>
    </main>
  );
}
