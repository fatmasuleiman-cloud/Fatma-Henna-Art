import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type ImageEntry = {
  id: number;
  src: string;
  alt?: string;
  category: "bridal" | "simple" | "body" | "minimal" | "special";
};

const images: ImageEntry[] = [
  { id: 1,  src: "/images/F4.jpg",     alt: "Bridal henna design on hands", category: "bridal"  },
  { id: 2,  src: "/images/client1.jpg",                                       category: "bridal"  },
  { id: 3,  src: "/images/F11.jpg",                                           category: "bridal"  },
  { id: 4,  src: "/images/S3.jpg",                                            category: "simple"  },
  { id: 5,  src: "/images/S1.jpg",                                            category: "simple"  },
  { id: 6,  src: "/images/F1.jpg",                                            category: "bridal"  },
  { id: 7,  src: "/images/F7.jpg",                                            category: "bridal"  },
  { id: 8,  src: "/images/S7.jpg",                                            category: "simple"  },
  { id: 9,  src: "/images/F9.jpg",                                            category: "bridal"  },
  { id: 10, src: "/images/S4.jpg",                                            category: "simple"  },
  { id: 11, src: "/images/SS1.jpg",                                           category: "simple"  },
  { id: 12, src: "/images/C2.jpg",                                            category: "special" },
  { id: 13, src: "/images/F12.jpg",                                           category: "bridal"  },
  { id: 14, src: "/images/B1.jpg",                                            category: "body"    },
  { id: 15, src: "/images/BB.jpg",                                            category: "body"    },
  { id: 16, src: "/images/j1.jpeg",                                           category: "bridal"  },
  { id: 17, src: "/images/j2.jpeg",                                           category: "bridal"  },
  { id: 18, src: "/images/j3.jpeg",                                           category: "bridal"  },
  { id: 19, src: "/images/j4.jpeg",                                           category: "bridal"  },
  { id: 20, src: "/images/j5.jpeg",                                           category: "bridal"  },
  { id: 21, src: "/images/j6.jpeg",                                           category: "bridal"  },
  { id: 22, src: "/images/j7.jpeg",                                           category: "bridal"  },
  { id: 23, src: "/images/j8.jpeg",                                           category: "bridal"  },
  { id: 24, src: "/images/j9.jpeg",                                           category: "bridal"  },
  { id: 25, src: "/images/j10.jpeg",                                          category: "bridal"  },
  { id: 26, src: "/images/B3.jpg",                                            category: "body"    },
  { id: 27, src: "/images/B4.jpg",                                            category: "body"    },
  { id: 28, src: "/images/F8.jpg",                                            category: "bridal"  },
  { id: 29, src: "/images/F10.jpg",                                           category: "bridal"  },
  { id: 30, src: "/images/BB2.jpg",                                           category: "body"    },
  { id: 31, src: "/images/BB3.jpg",                                           category: "body"    },
  { id: 32, src: "/images/F6.jpg",                                            category: "bridal"  },
  { id: 33, src: "/images/F7.jpg",                                            category: "bridal"  },
  { id: 34, src: "/images/leg.jpg",                                           category: "body"    },
  { id: 35, src: "/images/leg2.png",                                          category: "body"    },
  { id: 36, src: "/images/T2.jpg",                                            category: "special" },
  { id: 37, src: "/images/SM.jpg",                                            category: "minimal" },
  { id: 38, src: "/images/P1.jpg",                                            category: "minimal" },
  { id: 39, src: "/images/P2.jpg",                                            category: "minimal" },
  { id: 40, src: "/images/tiny.jpg",                                          category: "minimal" },
  { id: 41, src: "/images/M1.jpeg",                                           category: "minimal" },
  { id: 42, src: "/images/M2.jpeg",                                           category: "minimal" },
  { id: 43, src: "/images/M3.jpeg",                                           category: "minimal" },
  { id: 44, src: "/images/M4.jpeg",                                           category: "minimal" },
];

const FIRST_COUNT = 8;

const getAlt = (img: ImageEntry) =>
  img.alt ?? `${img.category.charAt(0).toUpperCase() + img.category.slice(1)} henna design`;

// ─── tiny hook: detect touch device ─────────────────────────────────────────
function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);
  return isTouch;
}

const Gallery = () => {
  const [expanded, setExpanded]             = useState(false);
  const [selectedIndex, setSelectedIndex]   = useState<number | null>(null);
  const [imgLoaded, setImgLoaded]           = useState(false);

  const isTouch = useIsTouch();

  // swipe tracking
  const touchStartX = useRef<number | null>(null);

  const filtered      = images;
  const visibleImages = expanded ? filtered : filtered.slice(0, FIRST_COUNT);
  const hasMore       = filtered.length > FIRST_COUNT && !expanded;

  // ── navigation helpers ───────────────────────────────────────────────────
  const goTo = useCallback((idx: number) => {
    setImgLoaded(false);
    setSelectedIndex(idx);
  }, []);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    goTo((selectedIndex - 1 + filtered.length) % filtered.length);
  }, [selectedIndex, filtered.length, goTo]);

  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    goTo((selectedIndex + 1) % filtered.length);
  }, [selectedIndex, filtered.length, goTo]);

  const close = useCallback(() => setSelectedIndex(null), []);

  // ── keyboard navigation ──────────────────────────────────────────────────
  useEffect(() => {
    if (selectedIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape")     close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex, goPrev, goNext, close]);

  // ── swipe handlers ───────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) delta < 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  return (
    <section id="gallery" className="py-20 bg-card">
      <div className="container mx-auto px-4">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-3">
            Gallery
          </h2>
          <p className="font-inter text-lg text-muted-foreground">
            Explore my latest henna artistry
          </p>
        </div>

        {/* ── Grid ────────────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No images in this category yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {visibleImages.map((image, index) => {
                // Find the TRUE index in the full filtered array
                const filteredIndex = filtered.indexOf(image);
                return (
                  <button
                    key={image.id}
                    onClick={() => { setImgLoaded(false); setSelectedIndex(filteredIndex); }}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-xl group p-0 border-0 shadow-sm hover:shadow-lg transition-shadow duration-300"
                    style={{
                      animationDelay: `${(index % FIRST_COUNT) * 60}ms`,
                    }}
                    aria-label={`Open ${getAlt(image)}`}
                  >
                    <img
                      src={image.src}
                      alt={getAlt(image)}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-107 transition-transform duration-500 ease-out"
                      style={{ transform: "scale(1)", transition: "transform 0.5s ease-out" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.07)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                    />
                    {/* Gradient overlay on hover — desktop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white text-xs font-medium tracking-wide capitalize">
                        {image.category}
                      </span>
                    </div>

                    {/* Category badge — always visible, top-right */}
                    <span className="absolute top-2 right-2 bg-black/40 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm capitalize opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {image.category}
                    </span>
                  </button>
                );
              })}

              {/* View more tile */}
              {hasMore && (
                <button
                  onClick={() => setExpanded(true)}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-2 transition-colors duration-200 bg-muted/30 hover:bg-muted/60"
                >
                  <span className="text-3xl font-bold text-foreground">+{filtered.length - FIRST_COUNT}</span>
                  <span className="text-sm text-muted-foreground font-medium">View all</span>
                </button>
              )}
            </div>

            {/* Collapse button when expanded */}
            {expanded && filtered.length > FIRST_COUNT && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setExpanded(false)}
                  className="text-sm text-muted-foreground hover:text-primary border border-border hover:border-primary rounded-full px-5 py-2 transition-colors"
                >
                  Show less
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Lightbox ────────────────────────────────────────────────────── */}
        {selectedIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            onClick={close}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium z-50">
              {selectedIndex + 1} / {filtered.length}
            </div>

            {/* Close */}
            <button
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              onClick={close}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Keyboard hint — desktop only */}
            {!isTouch && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs flex gap-4 z-50 select-none">
                <span>← → navigate</span>
                <span>Esc close</span>
              </div>
            )}

            {/* Swipe hint — touch only */}
            {isTouch && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs z-50 select-none">
                Swipe to navigate
              </div>
            )}

            {/* Prev / Next arrows */}
            <button
              className="absolute left-3 md:left-6 z-50 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-3 md:right-6 z-50 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <div
              className="relative max-w-4xl w-full px-16 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Loading skeleton */}
              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <img
                key={selectedIndex}             /* remount on change to re-trigger fade */
                src={filtered[selectedIndex].src}
                alt={getAlt(filtered[selectedIndex])}
                onLoad={() => setImgLoaded(true)}
                className="mx-auto max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl"
                style={{
                  opacity: imgLoaded ? 1 : 0,
                  transition: "opacity 0.35s ease",
                }}
              />

              {/* Caption strip */}
              {imgLoaded && (
                <div className="mt-4 flex items-center gap-3">
                  <span className="bg-primary/80 text-white text-xs px-3 py-1 rounded-full capitalize font-medium">
                    {filtered[selectedIndex].category}
                  </span>
                  <p className="text-white/80 text-sm font-medium">
                    {getAlt(filtered[selectedIndex])}
                  </p>
                </div>
              )}

              {/* Thumbnail strip */}
              {filtered.length > 1 && imgLoaded && (
                <div className="mt-4 flex gap-2 overflow-x-auto max-w-full pb-1 px-2 scrollbar-hide">
                  {filtered.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={(e) => { e.stopPropagation(); goTo(idx); }}
                      className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden transition-all duration-200 border-2
                        ${idx === selectedIndex ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-80"}`}
                      aria-label={`Go to image ${idx + 1}`}
                    >
                      <img
                        src={img.src}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

    
      </div>
    </section>
  );
};

export default Gallery;
