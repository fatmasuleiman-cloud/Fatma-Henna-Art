import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, ChevronUp, MessageCircle, X } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
   YOUR PHOTOS  (everything lives in /public/images)
   • The first 8 are what visitors see on the page.
   • To change the order, cut a line and paste it somewhere else.
   • To add a photo: copy the file into public/images and add one line here.
   ──────────────────────────────────────────────────────────────────────────── */
type Photo = { file: string; label: string };

const BRIDAL = "Bridal henna design";
const SIMPLE = "Simple henna design";
const BODY = "Body henna art";
const MINIMAL = "Minimal henna design";
const SPECIAL = "Special occasion henna";
const LATEST = "Henna design by Fatma";

const PHOTOS: Photo[] = [
  { file: "F4.jpg", label: BRIDAL },
  { file: "client1.jpg", label: BRIDAL },
  { file: "F11.jpg", label: BRIDAL },
  { file: "S3.jpg", label: SIMPLE },
  { file: "S1.jpg", label: SIMPLE },
  { file: "F1.jpg", label: BRIDAL },
  { file: "F7.jpg", label: BRIDAL },
  { file: "S7.jpg", label: SIMPLE },
  { file: "F9.jpg", label: BRIDAL },
  { file: "S4.jpg", label: SIMPLE },
  { file: "SS1.jpg", label: SIMPLE },
  { file: "C2.jpg", label: SPECIAL },
  { file: "F12.jpg", label: BRIDAL },
  { file: "BB.jpg", label: BODY },
  ...Array.from({ length: 10 }, (_, i) => ({ file: `j${i + 1}.jpeg`, label: BRIDAL })),
  { file: "B3.jpg", label: BODY },
  { file: "B4.jpg", label: BODY },
  { file: "F8.jpg", label: BRIDAL },
  { file: "F10.jpg", label: BRIDAL },
  { file: "BB2.jpg", label: BODY },
  { file: "BB3.jpg", label: BODY },
  { file: "F6.jpg", label: BRIDAL },
  { file: "leg.jpg", label: BODY },
  { file: "leg2.png", label: BODY },
  { file: "T2.jpg", label: SPECIAL },
  { file: "SM.jpg", label: MINIMAL },
  { file: "P1.jpg", label: MINIMAL },
  { file: "P2.jpg", label: MINIMAL },
  { file: "tiny.jpg", label: MINIMAL },
  ...Array.from({ length: 4 }, (_, i) => ({ file: `M${i + 1}.jpeg`, label: MINIMAL })),
  // ── newest photos ──
  { file: "h1.jfif", label: LATEST },
  ...Array.from({ length: 13 }, (_, i) => ({ file: `oct-${i + 1}.jpeg`, label: LATEST })),
];

const FIRST_COUNT = 8;
const CARD_GAP = 24; // px, matches `md:gap-6` below
const WHATSAPP =
  "https://wa.me/254114532154?text=Hello%20Fatma%2C%20I%27d%20like%20to%20book%20a%20henna%20session";

const hideScrollbar = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

/* ────────────────────────────────────────────────────────────────────────────
   VIEWER
   Desktop: horizontal row of cards, Back / Next buttons, arrow keys, trackpad.
   Mobile : full-screen vertical feed, swipe up / down (one photo per screen).
   ──────────────────────────────────────────────────────────────────────────── */
type ViewerProps = {
  photos: { src: string; alt: string }[];
  startIndex: number;
  onClose: () => void;
  onFail: (src: string) => void;
};

const Viewer = ({ photos, startIndex, onClose, onFail }: ViewerProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const ticking = useRef(false);

  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const horizontal = isDesktop();
    const pos = horizontal ? el.scrollLeft : el.scrollTop;
    const max = horizontal ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(1, pos / max) : 1);
    setAtStart(pos <= 4);
    setAtEnd(pos >= max - 4);
    if (pos > 24) setShowHint(false);
  }, []);

  const onScroll = () => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      ticking.current = false;
      update();
    });
  };

  // Jump straight to the photo that was tapped / the first "unseen" one.
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    const target = el?.children[startIndex] as HTMLElement | undefined;
    target?.scrollIntoView({ block: isDesktop() ? "nearest" : "start", inline: "start" });
    update();
  }, [startIndex, update]);

  // Lock the page behind, restore focus afterwards.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    window.addEventListener("resize", update);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", update);
      previouslyFocused?.focus?.();
    };
  }, [update]);

  // Move forward / back: a "page" of cards on desktop, one screen on mobile.
  const step = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (isDesktop()) {
      const card = el.children[0] as HTMLElement;
      const style = getComputedStyle(el);
      const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const unit = card.offsetWidth + CARD_GAP;
      const perPage = Math.max(1, Math.floor((el.clientWidth - padding + CARD_GAP) / unit));
      el.scrollBy({ left: dir * perPage * unit, behavior: scrollBehavior() });
    } else {
      el.scrollBy({ top: dir * el.clientHeight, behavior: scrollBehavior() });
    }
  }, []);

  const backToStart = () =>
    scrollerRef.current?.scrollTo({ top: 0, left: 0, behavior: scrollBehavior() });

  // Phones: browsers decide on their own whether a short / slow swipe is "enough" to
  // change the snap point, and often bounce back. So we decide ourselves:
  // any clear upward / downward swipe moves exactly one photo.
  const swipe = useRef<{ x: number; y: number; time: number; index: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const el = scrollerRef.current;
    if (!el || isDesktop()) return;
    const t = e.touches[0];
    swipe.current = {
      x: t.clientX,
      y: t.clientY,
      time: Date.now(),
      index: Math.round(el.scrollTop / el.clientHeight),
    };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = swipe.current;
    swipe.current = null;
    const el = scrollerRef.current;
    if (!start || !el || isDesktop()) return;

    const t = e.changedTouches[0];
    const dy = t.clientY - start.y;
    const dx = t.clientX - start.x;
    if (Math.abs(dx) > Math.abs(dy)) return; // sideways, ignore

    const elapsed = Math.max(1, Date.now() - start.time);
    const quickFlick = Math.abs(dy) > 30 && Math.abs(dy) / elapsed > 0.3;
    if (Math.abs(dy) < 50 && !quickFlick) return; // too small, let it settle back

    const lastIndex = el.children.length - 1;
    const target = Math.max(0, Math.min(lastIndex, start.index + (dy < 0 ? 1 : -1)));
    el.scrollTo({ top: target * el.clientHeight, behavior: scrollBehavior() });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  // Built once, so scrolling doesn't re-render every photo.
  const slides = useMemo(
    () =>
      photos.map((photo) => (
        <figure
          key={photo.src}
          className="flex h-full w-full shrink-0 snap-start snap-always items-center justify-center md:aspect-[3/4] md:w-auto md:snap-normal md:overflow-hidden md:rounded-2xl md:bg-[#1e1210] md:ring-1 md:ring-white/10"
        >
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            onError={() => onFail(photo.src)}
            className="h-full w-full object-contain"
          />
        </figure>
      )),
    [photos, onFail]
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Henna gallery"
      className="fixed inset-0 z-50 bg-[#140c0a] text-white"
    >
      {/* Progress: how far through the gallery you are */}
      <div className="absolute inset-x-0 top-0 z-30 h-1 bg-white/10">
        <div
          className="h-full bg-[#e8b4a0] transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <p className="font-playfair absolute left-8 top-5 z-30 hidden text-xl md:block">
        Fatma Henna Art
      </p>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-4 z-30 grid h-11 w-11 place-items-center rounded-full bg-black/55 ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-8 md:top-4"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Desktop Back / Next */}
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="Previous photos"
        disabled={atStart}
        className="absolute left-5 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/25 disabled:pointer-events-none disabled:opacity-25 md:grid"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Next photos"
        disabled={atEnd}
        className="absolute right-5 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/25 disabled:pointer-events-none disabled:opacity-25 md:grid"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Mobile: tiny hint until the first swipe */}
      {showHint && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center md:hidden">
          <span className="font-inter flex items-center gap-1.5 rounded-full bg-black/55 px-4 py-2 text-xs font-medium ring-1 ring-white/20 backdrop-blur-md">
            <ChevronUp className="h-4 w-4 animate-bounce" />
            Swipe up for more
          </span>
        </div>
      )}

      {/* The scroller: a vertical feed on phones, a horizontal row from tablet up */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={(e) => {
          // Mouse wheel scrolls the row sideways on desktop
          const el = scrollerRef.current;
          if (el && isDesktop() && Math.abs(e.deltaY) > Math.abs(e.deltaX)) el.scrollLeft += e.deltaY;
        }}
        onClick={(e) => {
          // Click on the empty dark area (desktop) to close
          if (e.target === e.currentTarget && isDesktop()) onClose();
        }}
        className={`flex h-full w-full snap-y snap-mandatory flex-col overflow-y-auto overscroll-contain md:snap-x md:snap-proximity md:flex-row md:items-center md:gap-6 md:overflow-x-auto md:overflow-y-hidden md:scroll-pl-20 md:px-20 md:pb-16 md:pt-20 ${hideScrollbar}`}
      >
        {slides}

        {/* Last stop: a friendly nudge to book */}
        <div className="flex h-full w-full shrink-0 snap-start flex-col items-center justify-center gap-5 px-8 text-center md:w-[min(30vw,24rem)] md:rounded-2xl md:border md:border-white/15">
          <p className="font-playfair text-3xl">Like what you see?</p>
          <p className="font-inter max-w-xs text-sm text-white/70">
            Message Fatma on WhatsApp to book your henna session.
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter inline-flex items-center gap-2 rounded-full bg-[#e8b4a0] px-6 py-3 text-sm font-semibold text-[#2a1a17] transition hover:bg-[#f0c2ae]"
          >
            <MessageCircle className="h-5 w-5" />
            Book via WhatsApp
          </a>
          <button
            type="button"
            onClick={backToStart}
            className="font-inter text-sm text-white/70 underline underline-offset-4 transition hover:text-white"
          >
            Back to the start
          </button>
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   GALLERY SECTION
   ──────────────────────────────────────────────────────────────────────────── */
const Gallery = () => {
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // If a file name is wrong or missing, it simply drops out instead of showing a broken box.
  const photos = useMemo(
    () =>
      PHOTOS.map((p) => ({ src: `/images/${p.file}`, alt: p.label })).filter(
        (p) => !failed.has(p.src)
      ),
    [failed]
  );

  const markFailed = useCallback(
    (src: string) => setFailed((prev) => new Set(prev).add(src)),
    []
  );
  const closeViewer = useCallback(() => setViewerIndex(null), []);

  return (
    <section id="gallery" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-3">
            Gallery
          </h2>
          <p className="font-inter text-lg text-muted-foreground">
            Explore my latest henna artistry
          </p>
        </div>

        {/* First 8 photos */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.slice(0, FIRST_COUNT).map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setViewerIndex(index)}
              aria-label={`Open ${photo.alt}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted p-0 shadow-sm transition-shadow duration-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                onError={() => markFailed(photo.src)}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </button>
          ))}
        </div>

        {photos.length > FIRST_COUNT && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setViewerIndex(FIRST_COUNT)}
              className="font-inter inline-flex items-center gap-2 rounded-full border border-primary px-7 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              View more images
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {viewerIndex !== null && (
          <Viewer
            photos={photos}
            startIndex={Math.min(viewerIndex, photos.length - 1)}
            onClose={closeViewer}
            onFail={markFailed}
          />
        )}
      </div>
    </section>
  );
};

export default Gallery;
