import { ArrowRight, Heart, Sparkles, Users } from "lucide-react";

// 👉 Change these two to your own photos (files inside /public/images).
const MAIN_PHOTO = "/images/F4.jpg"; // tall photo on the left
const SECOND_PHOTO = "/images/client1.jpg"; // small photo on the right (hidden automatically if the file isn't found)

// Thin display serif for the big heading. Falls back to Playfair (already on your site)
// if the Cormorant Garamond link isn't added to index.html yet.
const display = "font-['Cormorant_Garamond','Playfair_Display',serif]";

const values = [
  {
    icon: Heart,
    title: "Passionate Artist",
    text: "Creating beautiful henna art with love and dedication for every client",
  },
  {
    icon: Sparkles,
    title: "Quality Materials",
    text: "Using only premium black and brown henna for lasting, beautiful results",
  },
  {
    icon: Users,
    title: "Client Focused",
    text: "Personalized service for brides, events, and special occasions",
  },
];

// The words that scroll across the banner (edit freely)
const MARQUEE_WORDS = [
  "Bridal Henna",
  "Natural Artistry",
  "Custom Designs",
  "Elegant Details",
  "Handcrafted With Care",
  "Nairobi Henna Art",
  "Your Story In Henna",
];

const hideIfMissing = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

/* Four-pointed sparkle between the words */
const Sparkle = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="mx-6 h-4 w-4 shrink-0 text-[#f0c2ae] sm:mx-8 sm:h-5 sm:w-5"
    fill="currentColor"
  >
    <path d="M12 1.5c.7 5.9 4.6 9.8 10.5 10.5-5.9.7-9.8 4.6-10.5 10.5-.7-5.9-4.6-9.8-10.5-10.5C7.4 11.3 11.3 7.4 12 1.5z" />
  </svg>
);

/* One full pass of the words */
const MarqueeSet = () => (
  <div className="flex shrink-0 items-center">
    {MARQUEE_WORDS.map((word) => (
      <span key={word} className="flex shrink-0 items-center">
        <span className="whitespace-nowrap font-inter text-xs font-bold uppercase tracking-[0.16em] text-[#f4efe7] sm:text-sm">
          {word}
        </span>
        <Sparkle />
      </span>
    ))}
  </div>
);

/* Straight, brown, right-to-left scrolling banner */
const HennaMarquee = () => (
  <div
    className="henna-marquee relative overflow-hidden py-4 sm:py-5"
    style={{
      background:
        "linear-gradient(90deg, #2a1a17 0%, #4a2a20 22%, #8a4632 52%, #4a2a20 82%, #2a1a17 100%)",
    }}
  >
    <style>{`
      @keyframes henna-marquee-scroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      .henna-marquee-track {
        display: flex;
        width: max-content;
        animation: henna-marquee-scroll 45s linear infinite;
      }
      .henna-marquee:hover .henna-marquee-track { animation-play-state: paused; }
      @media (prefers-reduced-motion: reduce) {
        .henna-marquee-track { animation: none; }
      }
    `}</style>

    {/* Screen readers get the words once, not the endless repeats */}
    <p className="sr-only">{MARQUEE_WORDS.join(", ")}</p>

    <div
      aria-hidden="true"
      className="overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
        maskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
      }}
    >
      {/* Two identical halves, so moving by exactly 50% loops without a jump */}
      <div className="henna-marquee-track">
        <div className="flex shrink-0">
          <MarqueeSet />
          <MarqueeSet />
        </div>
        <div className="flex shrink-0">
          <MarqueeSet />
          <MarqueeSet />
        </div>
      </div>
    </div>
  </div>
);

const About = () => {
  return (
    <>
      <section id="about" className="bg-[#f4efe7] py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid items-start gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
            {/* ---------- LEFT: main photo ---------- */}
            <figure className="mx-auto w-full max-w-md lg:max-w-none">
              <img
                src={MAIN_PHOTO}
                alt="Intricate henna design by Fatma on a hand and forearm"
                className="aspect-[4/5] w-full object-cover lg:aspect-[3/4]"
                loading="lazy"
              />
            </figure>

            {/* ---------- RIGHT: text (+ small photo on wide screens) ---------- */}
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-12">
              <div className="text-center lg:text-left">
                <p className="font-inter text-xs font-semibold uppercase tracking-[0.2em] text-[#a4503a] mb-5">
                  About Fatma
                </p>

                <h2
                  className={`${display} text-5xl font-light leading-[0.95] tracking-tight text-[#2a1a17] sm:text-6xl xl:text-7xl`}
                >
                  Henna that
                  <span className="block italic text-[#a4503a]">tells your story.</span>
                </h2>

                <p className="font-inter mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#4a3a35] sm:text-lg lg:mx-0">
                  Hello! I'm Fatma Suleiman, a passionate henna artist based in Nairobi. With
                  experience in creating intricate designs, I specialize in variety of henna types,
                  custom patterns, and event artistry. Whether you're preparing for your wedding
                  day, celebrating a special occasion, or simply want to adorn yourself with
                  beautiful henna art, I'm here to bring your vision to life with precision and
                  care.
                </p>

                {/* What clients can expect: three short lines separated by hairlines */}
                <ul className="mx-auto mt-10 max-w-xl divide-y divide-[#2a1a17]/15 border-y border-[#2a1a17]/15 text-left lg:mx-0">
                  {values.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex items-start gap-4 py-4">
                      <Icon className="mt-1 h-5 w-5 shrink-0 text-[#a4503a]" aria-hidden="true" />
                      <div>
                        <h3 className="font-playfair text-lg font-semibold text-[#2a1a17]">
                          {title}
                        </h3>
                        <p className="font-inter text-sm leading-relaxed text-[#4a3a35]">{text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Small accent photo, only on wide screens, sitting lower like in your reference */}
              <figure className="hidden xl:block xl:mt-56">
                <img
                  src={SECOND_PHOTO}
                  alt="Another henna design by Fatma"
                  onError={hideIfMissing}
                  className="aspect-[3/4] w-full object-cover"
                  loading="lazy"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Moving banner: the last thing on the About page, right before Services */}
      <HennaMarquee />
    </>
  );
};

export default About;
