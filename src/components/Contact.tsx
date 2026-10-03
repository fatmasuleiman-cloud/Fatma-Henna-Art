import { useEffect, useRef, useState } from "react";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const WHATSAPP_BOOK =
  "https://wa.me/254114532154?text=Hello%20Fatma%2C%20I%27d%20like%20to%20book%20a%20henna%20session";

// Thin display serif for the big heading (same as the About section).
// Falls back to Playfair if the Cormorant Garamond link isn't in index.html.
const display = "font-['Cormorant_Garamond','Playfair_Display',serif]";

const details = [
  {
    icon: MessageCircle,
    label: "WhatsApp (Preferred)",
    value: "+254 114 532154",
    href: "https://wa.me/254114532154",
    external: true,
  },
  { icon: Phone, label: "Call", value: "0114 532154", href: "tel:0114532154" },
  {
    icon: Mail,
    label: "Email",
    value: "fatmasquare71@gmail.com",
    href: "mailto:fatmasquare71@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Nairobi, Kenya",
    note: "House visits available",
  },
];

/* A henna-style mandala, drawn with simple shapes. Decorative only. */
const Mandala = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="-100 -100 200 200"
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="0.45"
  >
    {[97, 85, 58, 31].map((r) => (
      <circle key={r} r={r} />
    ))}
    {Array.from({ length: 36 }, (_, i) => (
      <circle key={`d${i}`} cx="0" cy="-91" r="1.4" fill="currentColor" stroke="none" transform={`rotate(${i * 10})`} />
    ))}
    {Array.from({ length: 12 }, (_, i) => (
      <ellipse key={`p${i}`} cx="0" cy="-71.5" rx="8" ry="13" transform={`rotate(${i * 30})`} />
    ))}
    {Array.from({ length: 12 }, (_, i) => (
      <path key={`l${i}`} d="M0 -58 Q7 -44 0 -31 Q-7 -44 0 -58" transform={`rotate(${i * 30 + 15})`} />
    ))}
    {Array.from({ length: 8 }, (_, i) => (
      <ellipse key={`q${i}`} cx="0" cy="-19.5" rx="4.5" ry="9" transform={`rotate(${i * 45})`} />
    ))}
    <circle r="4" fill="currentColor" stroke="none" />
  </svg>
);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // One gentle entrance, played once when the section scrolls into view.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const rise = (delay: number) => ({
    className: `transition-all duration-700 ease-out motion-reduce:transition-none ${
      inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`,
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#7b3828] pb-10 pt-28 text-[#f8f1e8] sm:pb-12 sm:pt-32 lg:pb-12 lg:pt-28"
    >
      <style>{`
        @keyframes contact-mandala-turn { to { transform: rotate(360deg); } }
        .contact-mandala { animation: contact-mandala-turn 240s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .contact-mandala { animation: none; } }
      `}</style>

      {/* Slow-turning henna mandala, half hidden behind the heading corner */}
      <Mandala className="contact-mandala pointer-events-none absolute -bottom-40 -left-40 -z-10 h-[30rem] w-[30rem] text-[#e8b4a0]/20 sm:-bottom-52 sm:-left-48 sm:h-[38rem] sm:w-[38rem] lg:-bottom-56 lg:-left-44 lg:h-[46rem] lg:w-[46rem]" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          {/* ---------- LEFT: the big statement ---------- */}
          <div className="text-center lg:text-left">
            <p
              style={rise(0).style}
              className={`font-inter mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8b4a0] ${rise(0).className}`}
            >
              Bookings &amp; enquiries
            </p>

            <h2
              style={rise(150).style}
              className={`${display} text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl lg:text-[4.5rem] ${rise(150).className}`}
            >
              Let’s create
              <span className="block italic text-[#f0c2ae]">something beautiful.</span>
            </h2>
          </div>

          {/* ---------- RIGHT: how to reach Fatma ---------- */}
          <div className="mx-auto w-full max-w-md text-center lg:mx-0 lg:max-w-none lg:pt-12 lg:text-left">
            <p
              style={rise(300).style}
              className={`font-inter text-base leading-relaxed text-[#f3dccf] sm:text-lg ${rise(300).className}`}
            >
              Tell me about your occasion, preferred design and date. WhatsApp is the quickest way
              to book.
            </p>

            <div style={rise(420).style} className={`mt-8 ${rise(420).className}`}>
              <a
                href={WHATSAPP_BOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter group inline-flex items-center gap-4 bg-[#f8f1e8] px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#2a1a17] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f8f1e8]"
              >
                Book a henna session
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>

            <ul
              style={rise(560).style}
              className={`mt-10 divide-y divide-white/15 border-y border-white/15 text-left ${rise(560).className}`}
            >
              {details.map(({ icon: Icon, label, value, href, external, note }) => {
                const inner = (
                  <>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition-colors duration-300 group-hover:bg-[#e8b4a0] group-hover:text-[#2a1a17]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-inter block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#e8b4a0]">
                        {label}
                      </span>
                      <span className="font-inter block break-words text-base font-medium text-white sm:text-lg">
                        {value}
                      </span>
                      {note && (
                        <span className="font-inter block text-sm text-[#f3dccf]/80">{note}</span>
                      )}
                    </span>
                    {href && (
                      <ArrowRight
                        className="h-4 w-4 shrink-0 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    )}
                  </>
                );

                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center gap-4 py-3 transition-colors hover:text-[#f0c2ae] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f8f1e8]"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="group flex items-center gap-4 py-3">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
