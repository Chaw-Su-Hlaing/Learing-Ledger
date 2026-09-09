import { useMemo } from 'react'
import { Section } from '../components/Section'
import { useAuth } from '../context/AuthContext'
import { LANGUAGE_BY_ID } from '../lib/constants'
import { formatDateLabel } from '../lib/format'
import { useStudySessions } from '../lib/useStudySessions'

export function HistoryPage() {
  const { user } = useAuth()
  const { sessions, loading } = useStudySessions(user?.id)

  const languageTotals = useMemo(() => {
    const totals = new Map<string, number>()
    for (const s of sessions) {
      totals.set(s.language, (totals.get(s.language) ?? 0) + s.duration_minutes)
    }
    return [...totals.entries()]
      .map(([language, minutes]) => ({ language: language as keyof typeof LANGUAGE_BY_ID, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
  }, [sessions])

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, typeof sessions>()
    for (const s of sessions) {
      const list = groups.get(s.session_date) ?? []
      list.push(s)
      groups.set(s.session_date, list)
    }
    return [...groups.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
  }, [sessions])

  return (
    <Section index="03" title="Study History">
      {loading ? (
        <p className="empty-note">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="empty-note">No study sessions recorded yet.</p>
      ) : (
        <>
          <div className="lang-total-row">
            {languageTotals.map(({ language, minutes }) => {
              const lang = LANGUAGE_BY_ID[language]
              return (
                <div className="lang-total-card" key={language} data-accent={lang.accent}>
                  <span className="lang-code">{lang.code}</span>
                  <p className="lang-total-name">{lang.label}</p>
                  <p className="lang-total-minutes">
                    <span className="lang-total-value">{minutes}</span> min total
                  </p>
                </div>
              )
            })}
          </div>

          {groupedByDate.map(([date, daySessions]) => {
            const dayTotal = daySessions.reduce((sum, s) => sum + s.duration_minutes, 0)
            return (
              <div className="history-day" key={date}>
                <div className="history-day-header">
                  <span>{formatDateLabel(date)}</span>
                  <span>{dayTotal} min</span>
                </div>
                <div className="session-list">
                  {daySessions.map((s) => {
                    const lang = LANGUAGE_BY_ID[s.language]
                    return (
                      <div className="session-card" key={s.id} data-accent={lang.accent}>
                        <div className="session-card-header">
                          <span className="session-lang">
                            <span className="lang-code">{lang.code}</span> {lang.label}
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
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </>
      )}
    </Section>
  )
}
