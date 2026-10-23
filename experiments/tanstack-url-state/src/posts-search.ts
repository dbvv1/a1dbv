export type PostsSearch = {
  q?: string
  sort?: 'asc' | 'desc'
}

export const postsSearchDefaults = { q: '', sort: 'asc' } as const

// URL input is untrusted and may already be parsed as JSON (number/object/etc.).
export function validatePostsSearch(search: Record<string, unknown>): PostsSearch {
  return {
    q: typeof search.q === 'string' ? search.q : '',
    sort: search.sort === 'desc' ? 'desc' : 'asc',
  }
}
