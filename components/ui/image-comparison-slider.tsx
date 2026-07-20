"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState,
} from "react";

type ImageComparisonProps = {
  beforeImage: string;
  afterImage: string;
  altBefore?: string;
  altAfter?: string;
  initialPosition?: number;
  className?: string;
};

type ComparisonStyle = CSSProperties & {
  "--comparison-position": string;
};

export function ImageComparison({
  beforeImage,
  afterImage,
  altBefore = "Before",
  altAfter = "After",
  initialPosition = 50,
  className = "",
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const setPositionFromPointer = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(4, Math.min(96, position)));
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setPositionFromPointer(event.clientX);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPositionFromPointer(event.clientX);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const style: ComparisonStyle = {
    "--comparison-position": `${sliderPosition}%`,
  };

  return (
    <div
      ref={containerRef}
      data-comparison
      className={`relative aspect-[8/5] w-full touch-none select-none overflow-hidden rounded-[16px] bg-[#081423] shadow-[0_30px_80px_rgba(3,10,20,0.28)] ${className}`}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="group"
      aria-label="Before and after lead dashboard comparison"
    >
      <Image
        src={beforeImage}
        alt={altBefore}
        fill
        sizes="(max-width: 1023px) 100vw, 62vw"
        className="pointer-events-none object-cover"
        draggable={false}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath:
            "inset(0 calc(100% - var(--comparison-position)) 0 0)",
        }}
      >
        <Image
          src={afterImage}
          alt={altAfter}
          fill
          sizes="(max-width: 1023px) 100vw, 62vw"
          className="pointer-events-none object-cover object-left"
          draggable={false}
        />
      </div>

      <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/15 bg-[#07111f]/80 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md sm:left-5 sm:top-5">
        After
      </div>
      <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/15 bg-[#07111f]/80 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md sm:right-5 sm:top-5">
        Before
      </div>

      <div
        data-comparison-line
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.55)]"
        style={{ left: "var(--comparison-position)" }}
      >
        <div
          className={`absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-[#f6f9fc] text-[#142638] shadow-xl transition-transform duration-200 sm:h-12 sm:w-12 ${
            isDragging ? "scale-110" : ""
          }`}
        >
          <span aria-hidden className="font-mono text-sm tracking-[-0.2em]">
            ‹ ›
          </span>
        </div>
      </div>

      <input
        type="range"
        min="4"
        max="96"
        value={sliderPosition}
        onChange={(event) => setSliderPosition(Number(event.target.value))}
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        aria-label="Comparison position"
        aria-valuetext={`${Math.round(sliderPosition)} percent after result visible`}
      />
    </div>
  );
}
