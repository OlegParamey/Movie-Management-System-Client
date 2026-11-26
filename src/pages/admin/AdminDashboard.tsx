import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../../api/movies'
import type { MovieInput } from '../../api/movies'
import { errorMessage } from '../../api/client'
import type { Movie } from '../../types'

const emptyForm = {
  title: '',
  year: '',
  genres: '',
  director: '',
  cast: '',
  description: '',
  posterUrl: '',
}

export default function AdminDashboard() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function loadMovies() {
    setLoading(true)

    try {
      const first = await getMovies({ limit: 100, page: 1 })
      const allMovies = [...first.data]

      for (let page = 2; page <= first.pages; page++) {
        const result = await getMovies({ limit: 100, page })
        allMovies.push(...result.data)
      }

      setMovies(allMovies)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMovies()
  }, [])

  function changeField(
    field: keyof typeof emptyForm,
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  function openAddForm() {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    setMessage('')
    setShowForm(true)
  }

  function editMovie(movie: Movie) {
    setEditingId(movie._id)

    setForm({
      title: movie.title,
      year: movie.year?.toString() || '',
      genres: movie.genres.join(', '),
      director: movie.director || '',
      cast: movie.cast.join(', '),
      description: movie.description || '',
      posterUrl: movie.posterUrl || '',
    })

    setError('')
    setMessage('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setError('')
    setMessage('')

    if (!form.title.trim()) {
      setError('Title is required')
      return
    }

    setSaving(true)

    const movie: MovieInput = {
      title: form.title.trim(),
      year: form.year ? Number(form.year) : undefined,
      genres: form.genres
        .split(',')
        .map((genre) => genre.trim().toLowerCase())
        .filter(Boolean),
      director: form.director.trim(),
      cast: form.cast
        .split(',')
        .map((actor) => actor.trim())
        .filter(Boolean),
      description: form.description.trim(),
      posterUrl: form.posterUrl.trim(),
    }

    try {
      if (editingId) {
        await updateMovie(editingId, movie)
        setMessage('Movie updated successfully')
      } else {
        await createMovie(movie)
        setMessage('Movie added successfully')
      }

      resetForm()
      await loadMovies()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(movie: Movie) {
    const confirmed = window.confirm(
      `Delete "${movie.title}"?`,
    )

    if (!confirmed) return

    setError('')
    setMessage('')
    setSaving(true)

    try {
      await deleteMovie(movie._id)

      if (editingId === movie._id) {
        resetForm()
      }

      setMessage('Movie deleted successfully')
      await loadMovies()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h1>Admin panel</h1>

      <div className="admin-header">
        <h2>Manage movies ({movies.length})</h2>

        <button
          type="button"
          onClick={openAddForm}
          disabled={saving}
        >
          + Add movie
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit movie' : 'Add movie'}</h2>

          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(e) => changeField('title', e.target.value)}
            />
          </label>

          <label>
            Release year
            <input
              type="number"
              min="1888"
              max="2100"
              value={form.year}
              onChange={(e) => changeField('year', e.target.value)}
            />
          </label>

          <label>
            Genres
            <input
              placeholder="action, drama, sci-fi"
              value={form.genres}
              onChange={(e) => changeField('genres', e.target.value)}
            />
          </label>

          <label>
            Director
            <input
              value={form.director}
              onChange={(e) => changeField('director', e.target.value)}
            />
          </label>

          <label>
            Cast
            <input
              placeholder="Actor 1, Actor 2"
              value={form.cast}
              onChange={(e) => changeField('cast', e.target.value)}
            />
          </label>

          <label>
            Poster URL
            <input
              type="url"
              value={form.posterUrl}
              onChange={(e) => changeField('posterUrl', e.target.value)}
            />
          </label>

          <label>
            Description
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => changeField('description', e.target.value)}
            />
          </label>

          <div className="admin-actions">
            <button type="submit" disabled={saving}>
              {editingId ? 'Save changes' : 'Add movie'}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="muted">Loading movies...</p>}

      {!loading && movies.length === 0 && (
        <p className="muted">No movies found.</p>
      )}

      {!loading && movies.length > 0 && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Genres</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.year || '-'}</td>
                  <td>{movie.genres.join(', ')}</td>

                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        onClick={() => editMovie(movie)}
                        disabled={saving}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(movie)}
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}