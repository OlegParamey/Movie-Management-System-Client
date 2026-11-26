import { useEffect, useState } from 'react'
import { getMovies } from '../api/movies'
import { errorMessage } from '../api/client'
import MovieCard from '../components/MovieCard'
import type { Movie } from '../types'

export default function Catalog() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [year, setYear] = useState('')
  const [sort, setSort] = useState<'title' | 'year' | 'rating'>('title')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const [movies, setMovies] = useState<Movie[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)

      getMovies({
        q: query || undefined,
        genre: genre || undefined,
        year: year ? Number(year) : undefined,
        sort,
        order,
        limit: 24,
      })
        .then((res) => {
          setMovies(res.data)
          setError('')
        })
        .catch((err) => setError(errorMessage(err)))
        .finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(timer)
  }, [query, genre, year, sort, order])

  function resetFilters() {
    setQuery('')
    setGenre('')
    setYear('')
    setSort('title')
    setOrder('asc')
  }

  return (
    <section>
      <h1>Catalog</h1>

      <div className="catalog-filters">
        <input
          type="search"
          placeholder="Search by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">All genres</option>
          <option value="action">Action</option>
          <option value="drama">Drama</option>
          <option value="sci-fi">Sci-fi</option>
          <option value="thriller">Thriller</option>
          <option value="comedy">Comedy</option>
          <option value="horror">Horror</option>
          <option value="romance">Romance</option>
          <option value="fantasy">Fantasy</option>
        </select>

        <input
          type="number"
          placeholder="Release year"
          min="1888"
          max="2100"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value as 'title' | 'year' | 'rating')
          }
        >
          <option value="title">Sort by title</option>
          <option value="year">Sort by year</option>
          <option value="rating">Sort by rating</option>
        </select>

        <select
          value={order}
          onChange={(e) =>
            setOrder(e.target.value as 'asc' | 'desc')
          }
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button type="button" onClick={resetFilters}>
          Clear filters
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading…</p>}

      {!loading && !error && movies.length === 0 && (
        <p className="muted">No movies found.</p>
      )}

      <div className="grid">
        {movies.map((m) => (
          <MovieCard key={m._id} movie={m} />
        ))}
      </div>
    </section>
  )
}