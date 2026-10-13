import Image from "@/components/site/static-image";
import Link from "@/components/site/site-link";
import { CalendarDays, ChevronRight } from "@/components/site/icons";

import { getPostsPaginated } from "@/lib/wordpress";
import { blogText, postHref } from "@/lib/luzik-blog";
import { wordpressImageUnoptimized } from "@/lib/wordpress-media";
import type { Post } from "@/lib/wordpress.d";

function stripHtml(value: string) {
  return blogText(value);
}

function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getFeaturedImage(post: Post) {
  const embedded = post._embedded?.["wp:featuredmedia"]?.[0];

  return embedded?.source_url ?? null;
}

export async function HomeLatestPosts() {
  const posts = (await getPostsPaginated(1, 4)).data;

  return (
    <section
      className="home-section"
      aria-labelledby="latest-posts-title"
    >
      <div className="luzik-container">
        <div className="home-section-heading">
          <p className="home-eyebrow">
            Strefa wiedzy kierowcy
          </p>

          <h2
            id="latest-posts-title"
            className="home-title"
          >
            Najnowsze wpisy na blogu
          </h2>

          <p className="home-copy">
            Praktyczne wskazówki, przepisy i przygotowanie do egzaminu.
            Wiedza, którą wykorzystasz podczas kursu i za kierownicą.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className={posts.length === 1 ? "mx-auto mt-12 max-w-3xl" : "mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"}>
            {posts.map((post) => {
              const title = stripHtml(post.title.rendered);
              const featuredImage = getFeaturedImage(post);

              return (
                <article
                  data-luzik-reveal="card"
                  key={post.id}
                  className={posts.length === 1 ? "group grid min-w-0 border border-[#e7e8ec] bg-white sm:grid-cols-2" : "group flex min-w-0 flex-col border border-[#e7e8ec] bg-white"}
                >
                  <Link
                    href={postHref(post.slug)}
                    className="relative block aspect-[4/3] overflow-hidden bg-luzik-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luzik-blue"
                    aria-label={`Przeczytaj wpis: ${title}`}
                  >
                    {featuredImage ? (
                      <Image
                        src={featuredImage}
                        unoptimized={wordpressImageUnoptimized(featuredImage)}
                        alt={title}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span
                        className="flex h-full items-center justify-center bg-luzik-surface px-6 text-center font-heading text-sm font-semibold uppercase text-luzik-text"
                        aria-hidden="true"
                      >
                        Szkoła Jazdy Luzik
                      </span>
                    )}

                    <span className="absolute left-0 top-0 bg-white px-3 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-[#71604a]">
                      Baza wiedzy
                    </span>
                  </Link>

                  <div className="flex flex-col justify-center p-5">
                    <p className="flex items-center gap-2 text-sm font-medium text-luzik-text">
                      <CalendarDays
                        size={16}
                        aria-hidden="true"
                        className="text-[#71604a]"
                      />
                      {formatPostDate(post.date)}
                    </p>

                    <h3 className="mt-3 font-heading text-xl font-semibold leading-7 text-luzik-ink">
                      <Link
                        href={postHref(post.slug)}
                        className="transition-colors hover:text-luzik-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luzik-blue"
                      >
                        {title}
                      </Link>
                    </h3>

                    <Link
                      href={postHref(post.slug)}
                      className="mt-4 inline-flex items-center gap-1 font-heading text-sm font-semibold uppercase tracking-wide text-luzik-ink transition-colors hover:text-luzik-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luzik-blue"
                    >
                      <ChevronRight
                        size={18}
                        aria-hidden="true"
                        className="text-[#71604a]"
                      />
                      Czytaj więcej
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-2xl bg-luzik-surface px-6 py-10 text-center">
            <p className="text-base leading-7 text-luzik-text">
              Przygotowujemy kolejne materiały dla kursantów.
              Masz pytanie o kurs lub pierwsze jazdy? Skontaktuj się z nami.
            </p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/blog"
            className="home-button"
          >
            Zobacz wszystkie wpisy
          </Link>
        </div>
      </div>
    </section>
  );
}

