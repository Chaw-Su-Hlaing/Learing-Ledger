import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { VocabularyEntry, VocabularyInput } from './types'

export function useVocabulary(userId: string | undefined) {
  const [entries, setEntries] = useState<VocabularyEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setEntries(data as VocabularyEntry[])
      setError(null)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addEntry = useCallback(
    async (input: VocabularyInput) => {
      if (!userId) return { error: 'Not signed in' }
      const { error } = await supabase.from('vocabulary').insert({ ...input, user_id: userId })
      if (!error) await refresh()
      return { error: error?.message ?? null }
    },
    [userId, refresh],
  )

  const setRemembered = useCallback(
    async (id: string, remembered: boolean) => {
      const { error } = await supabase.from('vocabulary').update({ remembered }).eq('id', id)
      if (!error) await refresh()
      return { error: error?.message ?? null }
    },
    [refresh],
  )

  const deleteEntry = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('vocabulary').delete().eq('id', id)
      if (!error) await refresh()
      return { error: error?.message ?? null }
    },
    [refresh],
  )

  return { entries, loading, error, addEntry, setRemembered, deleteEntry, refresh }
}
