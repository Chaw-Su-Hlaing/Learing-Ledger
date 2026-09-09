import { useMemo, useState } from 'react'
import { Chip } from '../components/Chip'
import { LanguageChip } from '../components/LanguageChip'
import { Section } from '../components/Section'
import { useAuth } from '../context/AuthContext'
import { LANGUAGES, LANGUAGE_BY_ID, SUBJECTS } from '../lib/constants'
import type { LanguageId } from '../lib/constants'
import { downloadCsv, printTableAsPdf } from '../lib/export'
import { useVocabulary } from '../lib/useVocabulary'

export function VocabularyPage() {
  const { user } = useAuth()
  const { entries, loading, addEntry, setRemembered } = useVocabulary(user?.id)

  const [language, setLanguage] = useState<LanguageId | null>(null)
  const [subject, setSubject] = useState<string | null>(null)
  const [word, setWord] = useState('')
  const [reading, setReading] = useState('')
  const [myanmar, setMyanmar] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filterLanguage, setFilterLanguage] = useState<LanguageId | 'all'>('all')
  const [filterSubject, setFilterSubject] = useState<string | 'all'>('all')

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

  const rememberedCount = filteredEntries.filter((e) => e.remembered).length

  const canSubmit = language !== null && subject !== null && word.trim().length > 0

  const handleAdd = async () => {
    if (!language || !subject) return
    setSubmitting(true)
    setError(null)
    const result = await addEntry({
      language,
      subject,
      word: word.trim(),
      reading: reading.trim() || null,
      myanmar_translation: myanmar.trim() || null,
    })
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
    } else {
      setWord('')
      setReading('')
      setMyanmar('')
    }
  }

  const handleExportCsv = () => {
    const rows = [
      ['Word', 'Reading', 'Myanmar', 'Language', 'Subject', 'Remembered'],
      ...filteredEntries.map((e) => [
        e.word,
        e.reading ?? '',
        e.myanmar_translation ?? '',
        LANGUAGE_BY_ID[e.language].label,
        e.subject,
        e.remembered ? 'Yes' : 'No',
      ]),
    ]
    downloadCsv('vocabulary.csv', rows)
  }

  const handleExportPdf = () => {
    printTableAsPdf(
      'Vocabulary List',
      ['Word', 'Reading', 'Myanmar', 'Language', 'Subject', 'Remembered'],
      filteredEntries.map((e) => [
        e.word,
        e.reading ?? '',
        e.myanmar_translation ?? '',
        LANGUAGE_BY_ID[e.language].label,
        e.subject,
        e.remembered ? 'Yes' : 'No',
      ]),
    )
  }

  return (
    <>
      <Section index="01" title="Add Vocabulary">
        <p className="field-label">Language</p>
        <div className="chip-row">
          {LANGUAGES.map((l) => (
            <LanguageChip key={l.id} language={l} active={language === l.id} onClick={() => setLanguage(l.id)} />
          ))}
        </div>

        <p className="field-label">Subject</p>
        <div className="chip-row">
          {SUBJECTS.map((s) => (
            <Chip key={s} active={subject === s} onClick={() => setSubject(s)}>
              {s}
            </Chip>
          ))}
        </div>

        <p className="field-label">Target language word</p>
        <input value={word} onChange={(e) => setWord(e.target.value)} placeholder="Enter word" />

        <p className="field-label">Reading / pronunciation (optional)</p>
        <input value={reading} onChange={(e) => setReading(e.target.value)} placeholder="e.g. ことば" />

        <p className="field-label">Myanmar translation</p>
        <input value={myanmar} onChange={(e) => setMyanmar(e.target.value)} placeholder="e.g. စကားလုံး" />

        {error && <p className="field-error">{error}</p>}

        <button type="button" className="primary-button" disabled={!canSubmit || submitting} onClick={handleAdd}>
          {submitting ? 'Adding…' : 'Add to List'}
        </button>
      </Section>

      <Section
        index="02"
        title="Vocab List"
        action={
          <div className="export-buttons">
            <button type="button" className="ghost-button" onClick={handleExportCsv} disabled={filteredEntries.length === 0}>
              ↓ Excel
            </button>
            <button type="button" className="ghost-button" onClick={handleExportPdf} disabled={filteredEntries.length === 0}>
              ↓ PDF
            </button>
          </div>
        }
      >
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
            All subjects
          </Chip>
          {presentSubjects.map((s) => (
            <Chip key={s} active={filterSubject === s} onClick={() => setFilterSubject(s)}>
              {s}
            </Chip>
          ))}
        </div>

        <p className="entry-count">
          {filteredEntries.length} entries · {rememberedCount} remembered
        </p>

        {loading ? (
          <p className="empty-note">Loading…</p>
        ) : filteredEntries.length === 0 ? (
          <p className="empty-note">No vocabulary yet. Add your first word above.</p>
        ) : (
          <div className="table-scroll">
            <table className="vocab-table">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Reading</th>
                  <th>Myanmar</th>
                  <th>Subject</th>
                  <th aria-label="Remembered">✓</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((e) => (
                  <tr key={e.id}>
                    <td className="vocab-word" lang={e.language}>
                      {e.word}
                    </td>
                    <td>{e.reading}</td>
                    <td>{e.myanmar_translation}</td>
                    <td>
                      <span className="tag">{e.subject}</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={e.remembered}
                        onChange={(ev) => setRemembered(e.id, ev.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </>
  )
}
