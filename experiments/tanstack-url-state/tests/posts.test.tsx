import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { createAppRouter } from '../src/router'

// Hand-authored independent oracle, deliberately neither sorted nor unique by prefix.
// Production loaders and redaxios execute unchanged; ONLY transport is controlled.
const fixtures = [
  { id: '1', title: 'Beta report', body: 'Body for Beta' },
  { id: '2', title: 'Alpha report', body: 'Body for Alpha' },
  { id: '3', title: 'Gamma note', body: 'Body for Gamma' },
  { id: '4', title: 'Delta report', body: 'Body for Delta' },
]
const transport = vi.fn(async (input: string | URL | Request) => {
  const url = String(input)
  if (url === 'https://jsonplaceholder.typicode.com/posts') {
    return new Response(JSON.stringify(fixtures), { status: 200 })
  }
  const id = url.match(/^https:\/\/jsonplaceholder.typicode.com\/posts\/([^/]+)$/)?.[1]
  if (id === 'i-do-not-exist') return new Response('null', { status: 200 })
  const post = fixtures.find((item) => item.id === id)
  if (post) return new Response(JSON.stringify(post), { status: 200 })
  throw new Error(`Unexpected transport target: ${url}`)
})
beforeEach(() => { transport.mockClear(); vi.stubGlobal('fetch', transport) })
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

async function start(url: string) {
  const history = createMemoryHistory({ initialEntries: [url] })
  const router = createAppRouter(history)
  const view = render(<RouterProvider router={router} />)
  // Cold lazy-module startup is not a one-second UI performance assertion.
  await screen.findByRole('status', {}, { timeout: 5000 })
  return { router, history, view, user: userEvent.setup() }
}
function titles() {
  return within(screen.getByRole('list', { name: 'Matching posts' }))
    .queryAllByRole('link').map((link) => link.textContent)
}
function expectAppliedSummary(filter: string, order: string) {
  expect(screen.getByText(`Applied filter: ${filter} · Title order: ${order}`)).toBeInTheDocument()
}
async function apply(user: ReturnType<typeof userEvent.setup>, q: string, sort = 'asc') {
  await user.clear(screen.getByRole('searchbox', { name: 'Filter titles' }))
  if (q) await user.type(screen.getByRole('searchbox', { name: 'Filter titles' }), q)
  await user.selectOptions(screen.getByRole('combobox', { name: 'Title order' }), sort)
  await user.click(screen.getByRole('button', { name: 'Apply' }))
}

describe('URL-backed Posts consumer flow (real Router + React DOM, controlled HTTP)', () => {
  it('keeps edited inputs as drafts until Apply updates the summary, results and URL together', async () => {
    const { user, history } = await start('/posts?q=report&sort=desc')
    const appliedURL = history.location.href
    expectAppliedSummary('“report”', 'Z to A')
    expect(screen.getByRole('button', { name: 'Apply' })).toHaveAccessibleDescription(
      'Edits take effect only after you select Apply.',
    )
    await user.clear(screen.getByRole('searchbox', { name: 'Filter titles' }))
    await user.type(screen.getByRole('searchbox', { name: 'Filter titles' }), '  Gamma  ')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Title order' }), 'asc')
    expect(screen.getByRole('searchbox')).toHaveValue('  Gamma  ')
    expect(screen.getByRole('combobox')).toHaveValue('asc')
    expectAppliedSummary('“report”', 'Z to A')
    expect(screen.getByRole('status')).toHaveTextContent(/^3 of 4 posts$/)
    expect(titles()).toEqual(['Delta report', 'Beta report', 'Alpha report'])
    expect(history.location.href).toBe(appliedURL)
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    await waitFor(() => expectAppliedSummary('“Gamma”', 'A to Z'))
    expect(screen.getByRole('status')).toHaveTextContent(/^1 of 4 posts$/)
    expect(titles()).toEqual(['Gamma note'])
    expect(history.location.search).toBe('?q=Gamma')
  })

  it('applies filter/sort, retains them through detail and back link, clears explicitly, and restores history', async () => {
    const { router, history, user } = await start('/posts')
    expect(titles()).toEqual(['Alpha report', 'Beta report', 'Delta report', 'Gamma note'])
    expectAppliedSummary('All titles', 'A to Z')
    await apply(user, 'REPORT', 'desc')
    await waitFor(() => expect(titles()).toEqual(['Delta report', 'Beta report', 'Alpha report']))
    expectAppliedSummary('“REPORT”', 'Z to A')
    expect(history.location.search).toBe('?q=REPORT&sort=desc')
    const sharedURL = history.location.href
    await user.click(screen.getByRole('link', { name: 'Delta report' }))
    await screen.findByText('Body for Delta')
    expect(history.location.pathname).toBe('/posts/4')
    expectAppliedSummary('“REPORT”', 'Z to A')
    expect(history.location.search).toBe('?q=REPORT&sort=desc')
    await user.click(screen.getByRole('link', { name: 'Back to results' }))
    await waitFor(() => expect(history.location.pathname).toBe('/posts'))
    expect(history.location.href).toBe(sharedURL)
    expectAppliedSummary('“REPORT”', 'Z to A')
    await user.click(screen.getByRole('link', { name: 'Clear filters' }))
    await waitFor(() => expect(history.location.search).toBe(''))
    expect(titles()).toEqual(['Alpha report', 'Beta report', 'Delta report', 'Gamma note'])
    expectAppliedSummary('All titles', 'A to Z')
    await act(async () => { history.back() })
    await waitFor(() => expect(screen.getByRole('searchbox')).toHaveValue('REPORT'))
    expect(titles()).toEqual(['Delta report', 'Beta report', 'Alpha report'])
    expectAppliedSummary('“REPORT”', 'Z to A')
    expect(history.location.search).toBe('?q=REPORT&sort=desc')
    await act(async () => { history.forward() })
    await waitFor(() => expect(screen.getByRole('searchbox')).toHaveValue(''))
    expect(screen.getByRole('combobox')).toHaveValue('asc')
    expectAppliedSummary('All titles', 'A to Z')
    expect(titles()).toEqual(['Alpha report', 'Beta report', 'Delta report', 'Gamma note'])
    expect(history.location.search).toBe('')
    expect(router.state.status).toBe('idle')
  })

  it('recreates a new router from a copied detail URL without prior component state', async () => {
    const first = await start('/posts?q=report&sort=desc')
    await first.user.click(screen.getByRole('link', { name: 'Beta report' }))
    await screen.findByText('Body for Beta')
    const url = first.history.location.href
    first.view.unmount()
    const second = await start(url)
    await screen.findByText('Body for Beta')
    expect(titles()).toEqual(['Delta report', 'Beta report', 'Alpha report'])
    expectAppliedSummary('“report”', 'Z to A')
    expect(screen.getByRole('searchbox')).toHaveValue('report')
    expect(screen.getByRole('combobox')).toHaveValue('desc')
    await second.user.click(screen.getByRole('link', { name: 'Back to results' }))
    await waitFor(() => expect(second.history.location.pathname).toBe('/posts'))
    expect(second.history.location.search).toBe('?q=report&sort=desc')
    expectAppliedSummary('“report”', 'Z to A')
  })

  it.each(['?q=123&sort=sideways', '?q=%7B%22bad%22%3Atrue%7D&sort=%5B%22desc%22%5D'])('uses safe defaults for malformed URL input %s', async (query) => {
    const { user, history } = await start(`/posts${query}`)
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByRole('combobox')).toHaveValue('asc')
    expectAppliedSummary('All titles', 'A to Z')
    expect(titles()).toEqual(['Alpha report', 'Beta report', 'Delta report', 'Gamma note'])
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    await waitFor(() => expect(history.location.search).toBe(''))
  })

  it('handles empty results and repeated submissions, then resets from a direct URL', async () => {
    const { user, history } = await start('/posts?q=absent&sort=desc')
    expect(titles()).toEqual([])
    expect(screen.getByText('No matching posts.')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('0 of 4 posts')
    expectAppliedSummary('“absent”', 'Z to A')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(titles()).toEqual([])
    await user.click(screen.getByRole('link', { name: 'Clear filters' }))
    await waitFor(() => expect(history.location.search).toBe(''))
    expect(screen.queryByText('No matching posts.')).not.toBeInTheDocument()
    expect(titles()).toHaveLength(4)
  })

  it('changes sort while filtered and accepts a typed empty query without retaining the old filter', async () => {
    const { user, history } = await start('/posts?q=report&sort=desc')
    await user.selectOptions(screen.getByRole('combobox'), 'asc')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    await waitFor(() => expect(titles()).toEqual(['Alpha report', 'Beta report', 'Delta report']))
    expect(history.location.search).toBe('?q=report')
    await apply(user, '')
    await waitFor(() => expect(history.location.search).toBe(''))
    expect(titles()).toEqual(['Alpha report', 'Beta report', 'Delta report', 'Gamma note'])
  })

  it('preserves upstream home, pathless navigation, not-found and post-error demonstrations', async () => {
    const { user } = await start('/posts?q=report')
    await user.click(screen.getByRole('link', { name: 'Non-existent Post' }))
    await screen.findByText('Post with id "i-do-not-exist" not found!')
    await user.click(screen.getByRole('link', { name: 'Home' }))
    await screen.findByText('Welcome Home!')
    await user.click(screen.getByRole('link', { name: 'Pathless Layout' }))
    await screen.findByText("I'm route A!")
    await user.click(screen.getByRole('link', { name: 'Go to Route B' }))
    await screen.findByText("I'm route B!")
    await user.click(screen.getByRole('link', { name: 'This Route Does Not Exist' }))
    await screen.findByText('This is the notFoundComponent configured on root route')
  })
})
