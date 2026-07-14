import { useEffect, useState } from 'react'

// Simulate an async data source (future: swap body for a real api call).
// Returns { data, loading } — same shape a real hook would, so pages don't change
// when we later connect the backend.
export function useMock<T>(factory: () => T, delay = 500): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    const t = setTimeout(() => {
      if (!alive) return
      setData(factory())
      setLoading(false)
    }, delay)
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [delay])

  return { data, loading }
}
