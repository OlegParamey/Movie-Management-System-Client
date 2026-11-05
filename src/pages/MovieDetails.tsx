import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMovie } from '../api/movies'
import { errorMessage } from '../api/client'
import type { Movie } from '../types'

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getMovie(id)
      .then(setMovie)
      .catch((err) => setError(errorMessage(err)))
  }, [id])

  if (error) return <p className="error">{error}</p>
  if (!movie) return <p className="muted">Loading…</p>

  return (
    <article>
      <h1>
        {movie.title} <span className="muted">({movie.year ?? '—'})</span>
      </h1>
      <p className="muted">
        {movie.genres.join(', ')} · {movie.director}
      </p>
      <p>{movie.description}</p>
      <p>Cast: {movie.cast.join(', ') || '—'}</p>
      {/* TODO: reviews list + review form, "add to list" button */}
    </article>
  )
}
