import { Link } from 'react-router'
import { useT } from '@/i18n'
import type { MessageKey } from '@/i18n'
import { imageFor } from '@/lib/images'

export interface ServiceCard {
  to: string
  title: MessageKey
  text: MessageKey
  image: string
}

/** Services shown on the home page. Each feature adds its card when it ships. */
export const SERVICES: ServiceCard[] = []

export function HomePage() {
  const { t } = useT()
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
        <img
          src={imageFor('hero')}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-35"
          fetchPriority="high"
        />
        <div className="relative max-w-2xl space-y-3 px-5 py-12 sm:px-10 sm:py-20">
          <h1 className="text-3xl font-semibold sm:text-4xl">{t('home.heroTitle')}</h1>
          <p className="text-base sm:text-lg">{t('home.heroText')}</p>
        </div>
      </section>

      <section aria-labelledby="services-title" className="space-y-4">
        <h2 id="services-title" className="text-2xl font-semibold text-primary">
          {t('home.servicesTitle')}
        </h2>
        {SERVICES.length === 0 ? (
          <p className="text-muted-foreground">{t('home.comingSoon')}</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li key={s.to}>
                <Link
                  to={s.to}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md"
                >
                  <img src={s.image} alt="" className="aspect-[16/9] w-full object-cover" loading="lazy" />
                  <span className="space-y-1 p-4">
                    <span className="block font-heading text-xl font-semibold text-primary group-hover:underline">
                      {t(s.title)}
                    </span>
                    <span className="block text-sm text-muted-foreground">{t(s.text)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
