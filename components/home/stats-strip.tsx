import {
  CalendarDays,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import { luzikGoogleReviewsUrl } from "@/lib/luzik-reviews";

interface StatItem {
  value: string;
  suffix?: string;
  label: string;
  icon: typeof CalendarDays;
  href?: string;
}

const stats: readonly StatItem[] = [
  {
    value: "12",
    suffix: " lat",
    label: "doświadczenia na rynku",
    icon: CalendarDays,
  },
  {
    value: "6100+",
    label: "przeszkolonych kursantów",
    icon: Users,
  },
  {
    value: "3500+",
    label: "pozytywnych opinii",
    icon: MessageCircle,
  },
  {
    value: "Google",
    label: "sprawdź aktualną ocenę",
    icon: Star,
    href: luzikGoogleReviewsUrl,
  },
];

export function StatsStrip() {
  return (
    <section
      aria-label="Najważniejsze liczby Szkoły Jazdy Luzik"
      className="border-b border-[#e4e6e8] bg-white"
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1500px]
          grid-cols-1
          divide-y
          divide-[#e4e6e8]
          sm:grid-cols-2
          sm:divide-y-0
          sm:divide-x
          lg:grid-cols-4
          lg:px-8
          xl:px-10
        "
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          const Element = stat.href ? "a" : "div";

          return (
            <Element
              key={stat.label}
              href={stat.href}
              target={stat.href ? "_blank" : undefined}
              rel={stat.href ? "noopener noreferrer" : undefined}
              className="
                group
                relative
                flex
                items-center
                gap-5
                px-6
                py-7
                sm:px-7
                lg:px-8
                lg:py-8
                xl:px-10
              "
            >
              {/* Niebieski akcent */}

              <div
                aria-hidden="true"
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[3px]
                  w-0
                  bg-[#1383ec]
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />

              {/* Ikona */}

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  home-stat-icon
                "
              >
                <Icon
                  size={20}
                  strokeWidth={2}
                />
              </div>

              {/* Treść */}

              <div className="min-w-0">
                <div className="flex items-baseline leading-none">
                  <span
                    className="
                      font-[var(--font-lexend)]
                      text-[30px]
                      font-semibold
                      tracking-[-0.03em]
                      text-[#111214]
                      sm:text-[32px]
                    "
                  >
                    {stat.value}
                  </span>

                  {stat.suffix && (
                    <span
                      className="
                        ml-1
                        font-[var(--font-lexend)]
                        text-[17px]
                        font-semibold
                        text-[#1383ec]
                      "
                    >
                      {stat.suffix}
                    </span>
                  )}
                </div>

                <p
                  className="
                    mt-2
                    font-[var(--font-inter)]
                    text-[12px]
                    font-medium
                    leading-5
                    text-[#7a7f84]
                  "
                >
                  {stat.label}
                </p>
              </div>
            </Element>
          );
        })}
      </div>
    </section>
  );
}
