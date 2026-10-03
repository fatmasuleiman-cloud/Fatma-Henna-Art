import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Volume2, VolumeX } from "lucide-react";

const VIDEO_SRC = "/videos/hero.mp4";

// Events the browser counts as a real "user gesture" (scrolling alone does not count).
const GESTURE_EVENTS = ["pointerdown", "touchend", "keydown", "click"] as const;

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // the sharp video (has the sound)
  const bgVideoRef = useRef<HTMLVideoElement>(null); // blurred, silent copy that fills the panel
  const userMuted = useRef(false); // true only if the visitor chose to mute
  const gestureArmed = useRef(false);
  const [muted, setMuted] = useState(false);

  // As soon as the visitor taps / clicks / presses a key anywhere,
  // switch the sound on automatically (no button needed).
  const armAutoUnmute = useCallback(() => {
    if (gestureArmed.current) return;
    gestureArmed.current = true;

    const unmute = () => {
      const video = videoRef.current;
      if (video && !userMuted.current) {
        video.muted = false;
        setMuted(false);
        video.play().catch(() => {});
      }
      GESTURE_EVENTS.forEach((e) => window.removeEventListener(e, unmute));
      gestureArmed.current = false;
    };

    GESTURE_EVENTS.forEach((e) =>
      window.addEventListener(e, unmute, { passive: true })
    );
  }, []);

  // Try to play WITH sound. If the browser blocks it, play muted and
  // turn the sound on at the visitor's first interaction.
  const startPlayback = useCallback(async () => {
    const video = videoRef.current;
    const bg = bgVideoRef.current;
    if (!video) return;

    bg?.play().catch(() => {});

    try {
      video.muted = userMuted.current;
      await video.play();
      setMuted(video.muted);
    } catch {
      video.muted = true;
      setMuted(true);
      video.play().catch(() => {});
      armAutoUnmute();
    }
  }, [armAutoUnmute]);

  // Play while the hero is on screen, pause when the visitor scrolls away.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startPlayback();
        } else {
          videoRef.current?.pause();
          bgVideoRef.current?.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [startPlayback]);

  // Keep the blurred background copy in step with the main video.
  const syncBackground = () => {
    const video = videoRef.current;
    const bg = bgVideoRef.current;
    if (video && bg && Math.abs(bg.currentTime - video.currentTime) > 0.4) {
      bg.currentTime = video.currentTime;
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    userMuted.current = next;
    setMuted(next);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-20 bg-gradient-to-br from-[#1e1210] via-[#2a1a17] to-[#3a2420]"
    >
      <div className="grid min-h-[calc(100svh-5rem)] grid-cols-1 lg:grid-cols-2">
        {/* ---------- LEFT HALF: content (same copy, links and buttons as before) ---------- */}
        <div className="flex items-center px-6 py-10 sm:px-10 lg:px-12 lg:py-8 xl:px-20">
          <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left text-white drop-shadow-lg">
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4 lg:mb-5 animate-fade-in leading-tight">
              Beautiful Henna Art{" "}
              <span className="italic font-normal text-[#f0c2ae]">
                for Your Special Moments
              </span>
            </h1>
            <p className="font-inter text-base sm:text-lg md:text-xl text-white/90 mb-4 lg:mb-6 animate-fade-in">
              Professional henna artist specializing in bridal, custom designs, and event henna
            </p>
            <p className="font-inter text-lg sm:text-xl md:text-2xl font-semibold text-amber-300 mb-6 lg:mb-8 animate-fade-in">
              Starting from Ksh. 500
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button asChild variant="hero" size="lg" className="text-lg">
                <a
                  href="https://wa.me/254114532154?text=Hello%20Fatma%2C%20I%27d%20like%20to%20book%20a%20henna%20session"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Book via WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg bg-transparent text-white border-white/60 hover:bg-white/10 hover:text-white"
              >
                <a href="#gallery">View Gallery</a>
              </Button>
            </div>

            <p className="font-inter text-sm text-white/80 mt-5 lg:mt-6">
              House visits available for an additional fee to cater for transport costs.
            </p>
          </div>
        </div>

        {/* ---------- RIGHT HALF: video panel (50% of the hero, edge to edge) ---------- */}
        <div className="relative h-[70svh] min-h-[420px] max-h-[640px] overflow-hidden bg-black lg:h-auto lg:max-h-none lg:min-h-0">
          {/* Blurred, silent copy that fills the whole panel so there are no empty bars */}
          <video
            ref={bgVideoRef}
            src={VIDEO_SRC}
            className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl opacity-70"
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          />

          {/* The real video: shown whole, with its sound, never cropped */}
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            className="absolute inset-0 z-10 h-full w-full object-contain"
            loop
            playsInline
            preload="auto"
            onTimeUpdate={syncBackground}
            aria-label="Fatma Henna Art: henna designs and bridal artistry"
          />

          {/* Small icon-only mute switch (no text) */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className="absolute bottom-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md ring-1 ring-white/25 transition hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
