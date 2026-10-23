import { Link, Outlet, createLazyRoute } from '@tanstack/react-router'

import { postsSearchDefaults } from './posts-search'

export const Route = createLazyRoute('/posts')({
  component: PostsLayoutComponent,
})

function PostsLayoutComponent() {
  const posts = Route.useLoaderData()
  const { q = '', sort = 'asc' } = Route.useSearch()
  const navigate = Route.useNavigate()
  const query = q.trim().toLocaleLowerCase('en')
  const visiblePosts = posts
    .filter((post) => post.title.toLocaleLowerCase('en').includes(query))
    .sort((a, b) => {
      const order = a.title.localeCompare(b.title, 'en') || String(a.id).localeCompare(String(b.id), 'en')
      return sort === 'desc' ? -order : order
    })

  return (
    <div className="p-2 flex gap-2">
      <section aria-label="Posts results">
        <form
          key={JSON.stringify([q, sort])}
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            void navigate({
              search: (prev) => ({
                ...prev,
                q: String(data.get('q') ?? '').trim(),
                sort: data.get('sort') === 'desc' ? 'desc' : 'asc',
              }),
            })
          }}
        >
          <label>
            Filter titles
            <input name="q" type="search" defaultValue={q} className="border p-1" />
          </label>
          <label>
            Title order
            <select name="sort" defaultValue={sort} className="border p-1">
              <option value="asc">A to Z</option>
              <option value="desc">Z to A</option>
            </select>
          </label>
          <button type="submit" className="border p-1">Apply</button>
          <Link to="/posts" search={postsSearchDefaults}>Clear filters</Link>
        </form>
        <p role="status">{visiblePosts.length} of {posts.length} posts</p>
        {visiblePosts.length === 0 && <p>No matching posts.</p>}
        <ul aria-label="Matching posts" className="list-disc pl-4">
          {visiblePosts.map((post) => (
            <li key={post.id}>
              <Link
                to="/posts/$postId"
                params={{ postId: post.id }}
                className="block py-1 px-2 text-blue-600 hover:opacity-75"
                activeProps={{ className: 'font-bold underline' }}
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
        {/* Keep the upstream error demonstration separate from real results. */}
        <Link to="/posts/$postId" params={{ postId: 'i-do-not-exist' }}>
          Non-existent Post
        </Link>
      </section>
      <Outlet />
    </div>
  )
}
