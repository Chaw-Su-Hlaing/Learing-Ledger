import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { TodayPage } from '../pages/TodayPage'
import { VocabularyPage } from '../pages/VocabularyPage'
import { FlashcardsPage } from '../pages/FlashcardsPage'
import { HistoryPage } from '../pages/HistoryPage'

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'history', label: 'History' },
] as const

type TabId = (typeof TABS)[number]['id']

export function LedgerShell() {
  const { signOut } = useAuth()
  const [tab, setTab] = useState<TabId>('today')

  return (
    <div className="ledger">
      <header className="ledger-header">
        <div>
          <p className="ledger-kicker">Study Journal</p>
          <h1 className="ledger-title">Language Ledger</h1>
        </div>
        <nav className="ledger-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`nav-tab${tab === t.id ? ' nav-tab-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
          <button type="button" className="sign-out" onClick={signOut}>
            Sign out
          </button>
        </nav>
      </header>

      <main className="ledger-body">
        {tab === 'today' && <TodayPage />}
        {tab === 'vocabulary' && <VocabularyPage />}
        {tab === 'flashcards' && <FlashcardsPage />}
        {tab === 'history' && <HistoryPage />}
      </main>
    </div>
  )
}
