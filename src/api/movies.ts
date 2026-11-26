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


export interface MovieInput {
  title: string
  year?: number
  genres: string[]
  director: string
  cast: string[]
  description: string
  posterUrl: string
}

export const createMovie = (movie: MovieInput) =>
  api.post<Movie>('/movies', movie).then((r) => r.data)

export const updateMovie = (id: string, movie: MovieInput) =>
  api.put<Movie>(`/movies/${id}`, movie).then((r) => r.data)

export const deleteMovie = (id: string) =>
  api.delete(`/movies/${id}`).then((r) => r.data)