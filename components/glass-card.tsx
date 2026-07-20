import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
  featured?: boolean;
};

export default function GlassCard({
  children,
  className = "",
  as: Tag = "div",
  featured = false,
}: Props) {
  return (
    <Tag
      className={`rounded-glass shadow-glass transition-transform duration-glass ${
        featured
          ? "glass-surface-strong scale-[1.03] border-[rgba(42,95,217,0.45)]"
          : "glass-surface hover:-translate-y-1 hover:shadow-lift"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
