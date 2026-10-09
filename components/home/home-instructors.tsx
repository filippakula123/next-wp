import Image from "next/image";
import Link from "next/link";
import { featuredInstructors } from "@/lib/luzik-team";

import {
  ArrowUpRight,
  Award,
  CheckCircle2,
} from "lucide-react";

const instructors = featuredInstructors.map(person => ({
  ...person,
  description: person.id === 'arkadiusz-jaros'
    ? 'Doświadczony instruktor i właściciel szkoły. Stawia na spokojną atmosferę i praktyczne przygotowanie do egzaminu.'
    : person.id === 'mariola-jaros'
      ? 'Prowadzi naukę jazdy kategorii B i B automat. Stawia na spokojną atmosferę, cierpliwość i indywidualne podejście.'
      : 'Prowadzi jazdy w spokojnej atmosferze i pomaga kursantom nabrać pewności za kierownicą.',
  objectPosition: 'center center',
}));

export function HomeInstructors() {
  return (
    <section
      aria-labelledby="home-instructors-title"
      className="relative overflow-hidden bg-[#111214] py-20 text-white sm:py-24 lg:py-28"
    >
      {/* Delikatne tło */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[-180px]
          top-[-180px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#1383ec]/[0.06]
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[-220px]
          left-[-180px]
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#1383ec]/[0.04]
          blur-3xl
        "
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-5 sm:px-7 lg:px-8 xl:px-10">
        {/* ================================================= */}
        {/* HEADER                                            */}
        {/* ================================================= */}

        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between lg:pb-12">
          <div className="max-w-[760px]">
            <div className="mb-5 flex items-center gap-3">
              <span className="luzik-accent-line h-[2px] w-10" />

              <span className="font-[var(--font-inter)] text-[11px] font-bold uppercase tracking-[0.16em] text-[#1383ec]">
                Nasz zespół
              </span>
            </div>

            <h2
              id="home-instructors-title"
              className="
                m-0
                font-[var(--font-lexend)]
                text-[36px]
                font-semibold
                leading-[1.12]
                tracking-[-0.025em]
                text-white
                sm:text-[44px]
                lg:text-[52px]
              "
            >
              Poznaj instruktorów,
              <span className="block text-white/55">
                którzy uczą jeździć na luzie.
              </span>
            </h2>

            <p className="mt-5 max-w-[650px] font-[var(--font-inter)] text-[15px] leading-7 text-white/55 sm:text-[16px]">
              Doświadczenie, spokój i indywidualne
              podejście do każdego kursanta. Nasz zespół
              pomaga przygotować się nie tylko do egzaminu,
              ale przede wszystkim do samodzielnej jazdy.
            </p>
          </div>

          {/* LINK */}

          <Link
            href="/szkola-jazdy-luzik-instruktorzy"
            className="
              inline-flex
              w-fit
              shrink-0
              items-center
              gap-3
              border
              border-white/15
              px-5
              py-3.5
              font-[var(--font-inter)]
              text-[11px]
              font-extrabold
              uppercase
              tracking-wide
              text-white
              no-underline
              transition-all
              hover:border-[#1383ec]
              hover:bg-[#1383ec]
            "
          >
            Poznaj cały zespół

            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* ================================================= */}
        {/* KARTY                                             */}
        {/* ================================================= */}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {instructors.map((instructor) => (
            <article
              data-luzik-reveal="card"
              key={instructor.id}
              className="
                group
                overflow-hidden
                border
                border-white/10
                bg-[#17181a]
                transition-transform
                duration-300
                hover:-translate-y-1
              "
            >
              {/* ZDJĘCIE */}

              <div className="relative aspect-[4/5] overflow-hidden bg-[#222326]">
                <Image
                  src={instructor.image}
                  alt={`Instruktor nauki jazdy - ${instructor.name}`}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
                  className="
                    object-cover
                    brightness-[0.93]
                    grayscale-[0.08]
                    transition-transform
                    duration-700
                    group-hover:scale-[1.035]
                  "
                  style={{
                    objectPosition:
                      instructor.objectPosition,
                  }}
                />

                {/* Gradient */}

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/85
                    via-black/10
                    to-transparent
                  "
                />

                {/* Numer */}

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    right-5
                    top-5
                    font-[var(--font-lexend)]
                    text-[28px]
                    font-semibold
                    leading-none
                    text-white/20
                  "
                >
                  {String(
                    instructors.findIndex(
                      (item) =>
                        item.id === instructor.id,
                    ) + 1,
                  ).padStart(2, "0")}
                </div>

                {/* Info na zdjęciu */}

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-luzik-yellow)] text-[#171819]">
                      <CheckCircle2 size={13} />
                    </span>

                    <span className="font-[var(--font-inter)] text-[10px] font-bold uppercase tracking-[0.12em] text-white/65">
                      Doświadczony instruktor
                    </span>
                  </div>

                  <h3 className="m-0 font-[var(--font-lexend)] text-[24px] font-semibold leading-tight text-white sm:text-[27px]">
                    <Link href={`/szkola-jazdy-luzik-instruktorzy#${instructor.id}`} className="text-white no-underline hover:text-[#5bb8ff]">{instructor.name}</Link>
                  </h3>

                  <p className="mt-2 font-[var(--font-inter)] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5bb8ff]">
                    {instructor.role}
                  </p>
                </div>
              </div>

              {/* OPIS */}

              <div className="flex flex-col gap-5 p-5 sm:p-6">
                <p className="m-0 min-h-[78px] font-[var(--font-inter)] text-[14px] leading-6 text-white/55">
                  {instructor.description}
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2">
                    <Award
                      size={16}
                      className="text-[#1383ec]"
                    />

                    <span className="font-[var(--font-inter)] text-[11px] font-semibold uppercase tracking-wide text-white/45">
                      Szkolenie kategorii {instructor.category}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      border
                      border-white/10
                      text-white/50
                      transition-all
                      group-hover:border-[#1383ec]
                      group-hover:bg-[#1383ec]
                      group-hover:text-white
                    "
                  >
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ================================================= */}
        {/* DOLNY CTA                                         */}
        {/* ================================================= */}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1383ec]/10 text-[#1383ec]">
              <CheckCircle2 size={17} />
            </div>

            <p className="m-0 font-[var(--font-inter)] text-[13px] leading-5 text-white/50">
              Spokojna atmosfera i indywidualne podejście
              do każdego kursanta.
            </p>
          </div>

          <Link
            href="/szkola-jazdy-luzik-instruktorzy"
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              font-[var(--font-inter)]
              text-[11px]
              font-extrabold
              uppercase
              tracking-wide
              text-white
              no-underline
              transition-colors
              hover:text-[#1383ec]
            "
          >
            Zobacz wszystkich instruktorów

            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArrowRightIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center"
    >
      →
    </span>
  );
}
