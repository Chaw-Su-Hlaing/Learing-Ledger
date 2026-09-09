import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { StudySession, StudySessionInput } from './types'

export function useStudySessions(userId: string | undefined) {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .order('session_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setSessions(data as StudySession[])
      setError(null)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addSession = useCallback(
    async (input: StudySessionInput) => {
      if (!userId) return { error: 'Not signed in' }
      const { error } = await supabase.from('study_sessions').insert({ ...input, user_id: userId })
      if (!error) await refresh()
      return { error: error?.message ?? null }
    },
    [userId, refresh],
  )

  const deleteSession = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('study_sessions').delete().eq('id', id)
      if (!error) await refresh()
      return { error: error?.message ?? null }
    },
    [refresh],
  )

  return { sessions, loading, error, addSession, deleteSession, refresh }
}
