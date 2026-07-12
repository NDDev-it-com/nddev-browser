/** Pins the first-run Cockpit onboarding state for an empty repository. */

import { describe, expect, it, mock } from 'bun:test'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'

// Stub the data hook so the test does not need a network mock or
// real polling. The shape mirrors the v2 CockpitData interface.
mock.module('./cockpit.data', () => ({
  useCockpitData: () => ({
    agents: [],
    activity: [],
    isPending: false,
  }),
}))

// RecentActivity now consumes useTasks directly. Stub it to return an
// empty page so the empty-state branch renders.
mock.module('@/modules/api/audit.hooks', () => ({
  useTasks: () => ({
    data: { pages: [{ tasks: [], nextCursor: null }] },
    isPending: false,
  }),
  taskScreenshotUrl: (id: number) => `/audit/screenshot/${id}`,
  useTaskScreenshotBaseUrl: () => null,
}))

const useBrowserosConnections = Object.assign(
  () => ({ data: { connections: [] }, isPending: false }),
  { getKey: () => ['browseros-connections'] },
)

mock.module('@/modules/api/connections.hooks', () => ({
  useBrowserosConnections,
  useConnectBrowseros: () => ({
    isPending: false,
    variables: undefined,
    mutateAsync: async () => ({ installed: true }),
  }),
  useDisconnectBrowseros: () => ({
    isPending: false,
    variables: undefined,
    mutateAsync: async () => ({ installed: false }),
  }),
}))

const { Cockpit } = await import('./Cockpit')

function renderApp(): string {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return renderToStaticMarkup(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Cockpit />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('Cockpit (v2)', () => {
  it('renders first-run onboarding when no agents or activity exist', () => {
    const html = renderApp()
    expect(html).toContain('Get started')
    expect(html).toContain('Ask your agent to try it.')
    expect(html).not.toContain('Running now')
    expect(html).not.toContain('Recent activity')
  })

  it('does NOT render an add-profile tile in the default v2 build', () => {
    const html = renderApp()
    expect(html).not.toContain('New profile')
    expect(html).not.toContain('harness . logins . guardrails')
  })

  it('hides ready-state empty sections during first-run onboarding', () => {
    const html = renderApp()
    expect(html).not.toContain('No agents connected')
    expect(html).not.toContain('Running now')
    expect(html).not.toContain('No recent activity')
  })
})
