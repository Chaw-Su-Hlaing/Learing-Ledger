import { useMemo, useState } from 'react'
import { Chip } from '../components/Chip'
import { LanguageChip } from '../components/LanguageChip'
import { Section } from '../components/Section'
import { useAuth } from '../context/AuthContext'
import { DURATION_PRESETS, LANGUAGES, LANGUAGE_BY_ID, SUBJECTS } from '../lib/constants'
import type { LanguageId } from '../lib/constants'
import { formatDateLabel, todayDateString } from '../lib/format'
import { useStudySessions } from '../lib/useStudySessions'

export function TodayPage() {
  const { user } = useAuth()
  const { sessions, loading, addSession, deleteSession } = useStudySessions(user?.id)

  const [language, setLanguage] = useState<LanguageId | null>(null)
  const [subjects, setSubjects] = useState<string[]>([])
  const [duration, setDuration] = useState(30)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = todayDateString()
  const todaySessions = useMemo(() => sessions.filter((s) => s.session_date === today), [sessions, today])
  const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration_minutes, 0)

  const toggleSubject = (subject: string) => {
    setSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
  }

  const canSubmit = language !== null && subjects.length > 0 && duration > 0

  const handleSubmit = async () => {
    if (!language) return
    setSubmitting(true)
    setError(null)
    const result = await addSession({
      language,
      subjects,
      duration_minutes: duration,
      notes: notes.trim() || null,
      session_date: today,
    })
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
    } else {
      setLanguage(null)
      setSubjects([])
      setDuration(30)
      setNotes('')
    }
  }

  return (
    <>
      <Section index="01" title="Record Today's Study">
        <p className="field-label">Language</p>
        <div className="chip-row">
          {LANGUAGES.map((l) => (
            <LanguageChip key={l.id} language={l} active={language === l.id} onClick={() => setLanguage(l.id)} />
          ))}
        </div>

        <p className="field-label">Subjects studied</p>
        <div className="chip-row">
          {SUBJECTS.map((s) => (
            <Chip key={s} active={subjects.includes(s)} onClick={() => toggleSubject(s)}>
              {s}
            </Chip>
          ))}
        </div>

        <p className="field-label">Duration (minutes)</p>
        <div className="chip-row">
          {DURATION_PRESETS.map((d) => (
            <Chip key={d} active={duration === d} onClick={() => setDuration(d)}>
              {d}
            </Chip>
          ))}
          <input
            type="number"
            min={1}
            className="duration-custom"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, Number(e.target.value) || 0))}
          />
        </div>

        <p className="field-label">Session notes</p>
        <textarea
          className="session-notes"
          rows={3}
          placeholder="What did you cover? Any breakthroughs or difficulties?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {error && <p className="field-error">{error}</p>}

        <button type="button" className="primary-button" disabled={!canSubmit || submitting} onClick={handleSubmit}>
          {submitting ? 'Recording…' : 'Record Session'}
        </button>
      </Section>

      <Section index="02" title="Today's Summary">
        <div className="summary-card">
          <p className="summary-date">{formatDateLabel(today)}</p>
          <p className="summary-minutes">
            <span className="summary-minutes-value">{totalMinutes}</span> min
          </p>
          <p className="summary-count">{todaySessions.length} sessions logged</p>
        </div>

        {loading ? (
          <p className="empty-note">Loading…</p>
        ) : todaySessions.length === 0 ? (
          <p className="empty-note">No sessions yet today.</p>
        ) : (
          <div className="session-list">
            {todaySessions.map((s) => (
              <div className="session-card" key={s.id} data-accent={LANGUAGE_BY_ID[s.language].accent}>
                <div className="session-card-header">
                  <span className="session-lang">
                    <span className="lang-code">{LANGUAGE_BY_ID[s.language].code}</span>{' '}
                    {LANGUAGE_BY_ID[s.language].label}
                  </span>
                  <span className="session-duration">{s.duration_minutes} min</span>
                </div>
                <div className="session-tags">
                  {s.subjects.map((subj) => (
                    <span className="tag" key={subj}>
                      {subj}
                    </span>
                  ))}
                </div>
                {s.notes && <p className="session-notes-text">{s.notes}</p>}
                <button type="button" className="text-button" onClick={() => deleteSession(s.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
