export type LanguageId =
  | 'japanese'
  | 'spanish'
  | 'french'
  | 'german'
  | 'chinese'
  | 'korean'
  | 'portuguese'
  | 'italian'

export type AccentGroup = 'rose' | 'teal' | 'blush'

export interface LanguageDef {
  id: LanguageId
  code: string
  label: string
  accent: AccentGroup
}

export const LANGUAGES: LanguageDef[] = [
  { id: 'japanese', code: 'JP', label: 'Japanese', accent: 'rose' },
  { id: 'spanish', code: 'ES', label: 'Spanish', accent: 'rose' },
  { id: 'french', code: 'FR', label: 'French', accent: 'teal' },
  { id: 'german', code: 'DE', label: 'German', accent: 'teal' },
  { id: 'chinese', code: 'CN', label: 'Chinese', accent: 'rose' },
  { id: 'korean', code: 'KR', label: 'Korean', accent: 'teal' },
  { id: 'portuguese', code: 'BR', label: 'Portuguese', accent: 'teal' },
  { id: 'italian', code: 'IT', label: 'Italian', accent: 'blush' },
]

export const LANGUAGE_BY_ID: Record<LanguageId, LanguageDef> = Object.fromEntries(
  LANGUAGES.map((l) => [l.id, l]),
) as Record<LanguageId, LanguageDef>

export const SUBJECTS = [
  'Vocabulary',
  'Grammar',
  'Reading',
  'Listening',
  'Speaking',
  'Writing',
  'Kanji / Characters',
  'Pronunciation',
  'Culture',
  'Media / TV / Film',
] as const

export type Subject = (typeof SUBJECTS)[number]

export const DURATION_PRESETS = [15, 30, 45, 60, 90, 120] as const
