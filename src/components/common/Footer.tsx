import { useT } from '@/i18n'
import { IMAGE_CREDITS } from '@/lib/images'

export function Footer() {
  const { t } = useT()
  return (
    <footer className="mt-12 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-6 text-sm text-muted-foreground">
        <p>{t('footer.note')}</p>
        <details>
          <summary className="cursor-pointer rounded-sm font-medium text-foreground">
            {t('footer.credits')}
          </summary>
          <ul className="mt-2 space-y-1">
            {IMAGE_CREDITS.map((c) => (
              <li key={c.key} className="break-words">
                <a href={c.page} className="underline underline-offset-2" rel="noreferrer" target="_blank">
                  {c.title.replace(/^File:/, '')}
                </a>{' '}
                — {c.artist || 'Unknown'}, {c.license}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </footer>
  )
}
