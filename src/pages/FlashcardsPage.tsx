import { useEffect, useMemo, useState } from 'react'
import { Chip } from '../components/Chip'
import { LanguageChip } from '../components/LanguageChip'
import { Section } from '../components/Section'
import { useAuth } from '../context/AuthContext'
import { LANGUAGES, LANGUAGE_BY_ID, SUBJECTS } from '../lib/constants'
import type { LanguageId } from '../lib/constants'
import { useVocabulary } from '../lib/useVocabulary'
import type { VocabularyEntry } from '../lib/types'

function shuffle(list: VocabularyEntry[]): VocabularyEntry[] {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function FlashcardsPage() {
  const { user } = useAuth()
  const { entries, loading, setRemembered } = useVocabulary(user?.id)

  const [filterLanguage, setFilterLanguage] = useState<LanguageId | 'all'>('all')
  const [filterSubject, setFilterSubject] = useState<string | 'all'>('all')
  const [deck, setDeck] = useState<VocabularyEntry[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)

  const presentLanguages = useMemo(
    () => LANGUAGES.filter((l) => entries.some((e) => e.language === l.id)),
    [entries],
  )
  const presentSubjects = useMemo(
    () => SUBJECTS.filter((s) => entries.some((e) => e.subject === s)),
    [entries],
  )

  const filteredEntries = useMemo(
    () =>
      entries.filter(
        (e) =>
          (filterLanguage === 'all' || e.language === filterLanguage) &&
          (filterSubject === 'all' || e.subject === filterSubject),
      ),
    [entries, filterLanguage, filterSubject],
  )

  useEffect(() => {
    setDeck(shuffle(filteredEntries))
    setIndex(0)
    setRevealed(false)
    setCorrect(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterLanguage, filterSubject, filteredEntries.length])

  const current = deck[index]

  const advance = async (gotIt: boolean) => {
    if (current) {
      if (gotIt) setCorrect((c) => c + 1)
      await setRemembered(current.id, gotIt)
    }
    setRevealed(false)
    setIndex((i) => Math.min(i + 1, deck.length))
  }

  const restart = () => {
    setDeck(shuffle(filteredEntries))
    setIndex(0)
    setRevealed(false)
    setCorrect(0)
  }

  return (
    <Section index="04" title="Flashcard Test">
      <div className="chip-row">
        <Chip active={filterLanguage === 'all'} onClick={() => setFilterLanguage('all')}>
          All
        </Chip>
        {presentLanguages.map((l) => (
          <LanguageChip key={l.id} language={l} active={filterLanguage === l.id} onClick={() => setFilterLanguage(l.id)} />
        ))}
      </div>
      <div className="chip-row">
        <Chip active={filterSubject === 'all'} onClick={() => setFilterSubject('all')}>
          All
        </Chip>
        {presentSubjects.map((s) => (
          <Chip key={s} active={filterSubject === s} onClick={() => setFilterSubject(s)}>
            {s}
          </Chip>
        ))}
      </div>

      {loading ? (
        <p className="empty-note">Loading…</p>
      ) : deck.length === 0 ? (
        <p className="empty-note">No vocabulary to test yet. Add some words on the Vocabulary tab first.</p>
      ) : (
        <>
          <div className="flashcard-progress-row">
            <span>
              {Math.min(index + 1, deck.length)} / {deck.length}
            </span>
            <span>{correct} correct</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(index / deck.length) * 100}%` }} />
          </div>

          {index >= deck.length ? (
            <div className="flashcard-done">
              <p>
                Deck complete — {correct} / {deck.length} correct.
              </p>
              <button type="button" className="primary-button" onClick={restart}>
                Test again
              </button>
            </div>
          ) : (
            <div
              className="flashcard"
              data-accent={LANGUAGE_BY_ID[current.language].accent}
              onClick={() => setRevealed(true)}
            >
              <span className="flashcard-tag">
                <span className="lang-code">{LANGUAGE_BY_ID[current.language].code}</span>{' '}
                {LANGUAGE_BY_ID[current.language].label} · {current.subject}
              </span>
              <p className="flashcard-word">{current.word}</p>
              {current.reading && <p className="flashcard-reading">{current.reading}</p>}

              {!revealed ? (
                <p className="flashcard-hint">tap to reveal →</p>
              ) : (
                <>
                  <p className="flashcard-answer">{current.myanmar_translation || '—'}</p>
                  <div className="flashcard-actions" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="forgot-button" onClick={() => advance(false)}>
                      Forgot
                    </button>
                    <button type="button" className="primary-button" onClick={() => advance(true)}>
                      Got it
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </Section>
  )
}
