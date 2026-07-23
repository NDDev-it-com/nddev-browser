/**
 * @license
 * Copyright 2025 BrowserOS
 */

import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { Hono } from 'hono'
import { requireTrustedOrigin } from '../../../src/api/middleware/require-trusted-origin'
import { resetAllowedOriginsForTesting } from '../../../src/api/utils/cors'

// In remote mode the loopback gate is bypassed, so these exercise the Origin
// allowlist in isolation. The loopback gate itself is covered separately below;
// under Hono's test client there is no bound Bun server, so isLocalhostRequest
// fails closed.
function buildApp() {
  return new Hono()
    .use('/*', requireTrustedOrigin({ allowRemote: true }))
    .get('/probe', (c) => c.json({ ok: true }))
    .post('/probe', (c) => c.json({ ok: true, method: 'POST' }))
}

describe('requireTrustedOrigin', () => {
  const previousEnv = process.env.BROWSEROS_TRUSTED_ORIGINS

  beforeEach(() => {
    process.env.BROWSEROS_TRUSTED_ORIGINS = 'chrome-extension://allowed'
    resetAllowedOriginsForTesting()
  })
  afterEach(() => {
    process.env.BROWSEROS_TRUSTED_ORIGINS = previousEnv
    resetAllowedOriginsForTesting()
  })

  it('allows no-Origin requests only in remote mode', async () => {
    const res = await buildApp().request('/probe')
    expect(res.status).toBe(200)
  })

  it('passes when Origin matches the allowlist', async () => {
    const res = await buildApp().request('/probe', {
      headers: { Origin: 'chrome-extension://allowed' },
    })
    expect(res.status).toBe(200)
  })

  it('rejects with 403 when Origin is unknown', async () => {
    const res = await buildApp().request('/probe', {
      headers: { Origin: 'https://example.com' },
    })
    expect(res.status).toBe(403)
    const body = (await res.json()) as { error?: { code?: string } }
    expect(body.error?.code).toBe('FORBIDDEN_ORIGIN')
  })

  it('rejects with 403 when Origin is the literal "null"', async () => {
    const res = await buildApp().request('/probe', {
      headers: { Origin: 'null' },
    })
    expect(res.status).toBe(403)
  })

  it('rejects POST with disallowed Origin without invoking the route handler', async () => {
    const app = new Hono()
      .use('/*', requireTrustedOrigin({ allowRemote: true }))
      .post('/probe', () => {
        throw new Error('handler must not run')
      })

    const res = await app.request('/probe', {
      method: 'POST',
      headers: { Origin: 'https://example.com' },
    })
    expect(res.status).toBe(403)
  })

  it('rejects port mismatches even when host matches', async () => {
    process.env.BROWSEROS_TRUSTED_ORIGINS = 'http://localhost:5173'
    resetAllowedOriginsForTesting()
    const res = await buildApp().request('/probe', {
      headers: { Origin: 'http://localhost:5174' },
    })
    expect(res.status).toBe(403)
  })

  it('treats the allowlist as case-sensitive', async () => {
    const res = await buildApp().request('/probe', {
      headers: { Origin: 'CHROME-EXTENSION://allowed' },
    })
    expect(res.status).toBe(403)
  })

  // Fail-closed loopback gate: outside remote mode a caller that cannot be
  // proven to be on the local socket is rejected before any route runs — this
  // closes the missing-Origin / non-loopback bypass.
  it('rejects non-loopback callers with 403 when remote mode is off', async () => {
    const app = new Hono()
      .use('/*', requireTrustedOrigin({ allowRemote: false }))
      .get('/probe', () => {
        throw new Error('handler must not run')
      })

    // Simulate a bound server whose peer IP is a non-loopback LAN address.
    const server = {
      requestIP: () => ({
        address: '192.168.1.50',
        family: 'IPv4',
        port: 5555,
      }),
    }
    const res = await app.request('/probe', {}, { server })
    expect(res.status).toBe(403)
    const body = (await res.json()) as { error?: { code?: string } }
    expect(body.error?.code).toBe('FORBIDDEN_NON_LOOPBACK')
  })

  it('allows loopback callers when remote mode is off', async () => {
    const app = new Hono()
      .use('/*', requireTrustedOrigin({ allowRemote: false }))
      .get('/probe', (c) => c.json({ ok: true }))

    const server = {
      requestIP: () => ({ address: '127.0.0.1', family: 'IPv4', port: 5555 }),
    }
    const res = await app.request(
      '/probe',
      { headers: { host: '127.0.0.1:9100' } },
      { server },
    )
    expect(res.status).toBe(200)
  })
})
