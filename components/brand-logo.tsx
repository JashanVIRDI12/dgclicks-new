import Image from "next/image";

type BrandLogoProps = {
  /** dark = white capsule so black wordmark stays legible on glass nav */
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
};

/**
 * Official Digi Clicks wordmark. Brand chrome only —
 * never stamp onto client logos or case-study client photography.
 */
export default function BrandLogo({
  variant = "light",
  className = "h-7 sm:h-8",
  priority = false,
}: BrandLogoProps) {
  const img = (
    <Image
      src="/logos/digi-clicks-transparent.png"
      alt="Digi Clicks"
      width={141}
      height={54}
      priority={priority}
      className={`w-auto object-contain ${className}`}
    />
  );

  if (variant === "dark") {
    return (
      <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1.5 shadow-[0_1px_0_rgba(255,255,255,0.4)]">
        {img}
      </span>
    );
  }

  return img;
}
