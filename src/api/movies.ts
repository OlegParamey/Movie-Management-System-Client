import { api } from './client'
import type { Movie, Paginated } from '../types'

export interface MovieQuery {
  q?: string
  genre?: string
  year?: number
  sort?: 'title' | 'year' | 'rating'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export const getMovies = (params: MovieQuery = {}) =>
  api.get<Paginated<Movie>>('/movies', { params }).then((r) => r.data)

export const getMovie = (id: string) => api.get<Movie>(`/movies/${id}`).then((r) => r.data)
