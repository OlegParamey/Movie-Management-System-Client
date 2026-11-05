export type Role = 'user' | 'admin'

export interface User {
  _id: string
  username: string
  email: string
  role: Role
}

export interface Movie {
  _id: string
  title: string
  year?: number
  genres: string[]
  director?: string
  cast: string[]
  description?: string
  posterUrl?: string
  avgRating: number
  reviewsCount: number
}

export interface Paginated<T> {
  data: T[]
  page: number
  limit: number
  total: number
  pages: number
}

export interface AuthResponse {
  token: string
  user: User
}
