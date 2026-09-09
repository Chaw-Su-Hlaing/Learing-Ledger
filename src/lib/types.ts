import type { LanguageId } from './constants'

export interface StudySession {
  id: string
  user_id: string
  language: LanguageId
  subjects: string[]
  duration_minutes: number
  notes: string | null
  session_date: string
  created_at: string
}

export type StudySessionInput = Pick<
  StudySession,
  'language' | 'subjects' | 'duration_minutes' | 'notes' | 'session_date'
>

export interface VocabularyEntry {
  id: string
  user_id: string
  language: LanguageId
  subject: string
  word: string
  reading: string | null
  myanmar_translation: string | null
  remembered: boolean
  created_at: string
}

export type VocabularyInput = Pick<
  VocabularyEntry,
  'language' | 'subject' | 'word' | 'reading' | 'myanmar_translation'
>
