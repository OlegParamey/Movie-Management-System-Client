import { Link } from 'react-router-dom'
import type { Movie } from '../types'

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link to={`/movies/${movie._id}`} className="card">
      <h3>{movie.title}</h3>
      <p className="muted">
        {movie.year ?? '—'} · {movie.genres.join(', ') || 'no genre'}
      </p>
      <p>
        ★ {movie.avgRating ? movie.avgRating.toFixed(1) : '–'}{' '}
        <span className="muted">({movie.reviewsCount})</span>
      </p>
    </Link>
  )
}
