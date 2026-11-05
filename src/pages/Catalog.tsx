import { useEffect, useState } from 'react'
import { getMovies } from '../api/movies'
import { errorMessage } from '../api/client'
import MovieCard from '../components/MovieCard'
import type { Movie } from '../types'

export default function Catalog() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // small debounce so we do not call the API on every keystroke
    const timer = setTimeout(() => {
      setLoading(true)
      getMovies({ q: query || undefined, limit: 24 })
        .then((res) => {
          setMovies(res.data)
          setError('')
        })
        .catch((err) => setError(errorMessage(err)))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <section>
      <h1>Catalog</h1>
      <input
        type="search"
        placeholder="Search by title…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading…</p>}
      {!loading && !error && movies.length === 0 && <p className="muted">No movies found.</p>}
      <div className="grid">
        {movies.map((m) => (
          <MovieCard key={m._id} movie={m} />
        ))}
      </div>
    </section>
  )
}
