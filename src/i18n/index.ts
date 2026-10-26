import { useCallback } from 'react'
import { en, type Dictionary, type MessageKey } from './en'
import { ml } from './ml'
import { useAppSelector } from '@/store/hooks'
import type { Language, Localized } from '@/types'

const dictionaries: Record<Language, Dictionary> = { en, ml }

export type TranslateVars = Record<string, string | number>

export function translate(lang: Language, key: MessageKey, vars?: TranslateVars): string {
  const template = dictionaries[lang][key]
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  )
}

/** Returns `t(key, vars)` for the current language, plus `pick()` for data that has both languages. */
export function useT() {
  const lang = useAppSelector((s) => s.i18n.language)
  const t = useCallback((key: MessageKey, vars?: TranslateVars) => translate(lang, key, vars), [lang])
  const pick = useCallback((text: Localized) => text[lang] || text.en, [lang])
  return { t, pick, lang }
}

export type { MessageKey }
