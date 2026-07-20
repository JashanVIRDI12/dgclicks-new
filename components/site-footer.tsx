import Link from "next/link";

const nav = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Work", href: "/#showcase" },
];

const social = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M6.5 8.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM5 10h3v9H5v-9zm5 0h2.9v1.25h.04c.4-.76 1.38-1.56 2.84-1.56C19.1 9.69 20 11.2 20 13.9V19h-3v-4.5c0-1.07-.02-2.45-1.5-2.45-1.5 0-1.73 1.17-1.73 2.38V19h-3v-9z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:hello@dgclicks.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(15,27,45,0.08)] bg-white pb-10 pt-16">
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl tracking-tight text-ink">
              DG Clicks
            </p>
            <p className="mt-3 max-w-sm text-sm text-slate">
              Clicks are cheap. Clients are the point. Bolton studio · remote
              bench · one pipeline.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4">Navigate</p>
            <ul className="space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="cursor-pointer text-sm text-slate transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Contact</p>
            <a
              href="mailto:hello@dgclicks.com"
              className="block cursor-pointer text-sm text-slate transition-colors hover:text-ink"
            >
              hello@dgclicks.com
            </a>
            <p className="mt-2 text-sm text-slate">Bolton, Ontario</p>
            <ul className="mt-5 flex gap-3">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(15,27,45,0.12)] text-slate transition-colors hover:border-cobalt hover:text-cobalt"
                    aria-label={s.label}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[rgba(15,27,45,0.08)] pt-6 text-caption text-slate sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DG Clicks. All rights reserved.</p>
          <p>Privacy · Terms</p>
        </div>
      </div>
    </footer>
  );
}
