/**
 * @license
 * Copyright 2025 BrowserOS
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MiddlewareHandler } from 'hono'
import type { Env } from '../types'
import { isAllowedOrigin } from '../utils/cors'
import { isLocalhostRequest } from '../utils/security'

/**
 * Fail-closed trust gate for every route.
 *
 * Outside an explicit remote policy the server is loopback-only, so any caller
 * that is not on the local socket is rejected. This closes the missing-Origin /
 * DNS-rebinding bypass: a request with no `Origin` header from a non-loopback
 * peer no longer passes. Present-but-untrusted origins are always rejected.
 */
export function requireTrustedOrigin(options: {
  allowRemote: boolean
}): MiddlewareHandler<Env> {
  return async (c, next) => {
    // In production Bun.serve always binds `c.env.server`, so the loopback gate
    // is always enforced; it is skipped only when there is no bound server
    // (test scaffolding), where the Origin allowlist below still applies.
    if (!options.allowRemote && c.env?.server && !isLocalhostRequest(c)) {
      return c.json(
        {
          error: {
            name: 'ForbiddenNonLoopback',
            message: 'Non-loopback access requires an explicit remote policy',
            code: 'FORBIDDEN_NON_LOOPBACK',
            statusCode: 403,
          },
        },
        403,
      )
    }

    const origin = c.req.header('Origin')
    if (origin !== undefined && !isAllowedOrigin(origin)) {
      return c.json(
        {
          error: {
            name: 'ForbiddenOrigin',
            message: 'Origin not allowed',
            code: 'FORBIDDEN_ORIGIN',
            statusCode: 403,
          },
        },
        403,
      )
    }
    return next()
  }
}
