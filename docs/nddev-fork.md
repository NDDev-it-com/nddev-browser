# nddev-browser fork notes

`NDDev-it-com/nddev-browser` is the NDDev fork of `browseros-ai/BrowserOS`.
It stays AGPL-3.0 and preserves upstream attribution. This document records the
fork-specific changes and how the fork keeps itself current.

## 1. CloakBrowser CDP backend (privacy-first browser automation)

The agent server (`packages/browseros-agent/apps/server`) drives the browser as
a Chrome DevTools Protocol client: `CdpBackend` connects to
`http://127.0.0.1:${cdpPort}`. By default `cdpPort` is the sidecar `ports.cdp`
(the embedded BrowserOS Chromium).

The fork adds a routing switch so the agent loop and every MCP tool connect to an
external CDP endpoint instead — the managed [CloakBrowser](https://github.com/CloakHQ/CloakBrowser)
stealth-Chromium daemon on `127.0.0.1:9222` (installed and kept alive by the
`rldyour-new-mac-or-ubuntu` bootstrap: launchd on macOS, systemd `--user` on
Linux). This makes browser automation privacy-first (reduced automation
fingerprint) and, importantly, **decoupled from the browser shell** — the agent
platform runs standalone against CloakBrowser.

| Env var | Effect |
| --- | --- |
| `NDDEV_BROWSER_BACKEND=cloakbrowser` | Route the agent CDP to the CloakBrowser daemon (`127.0.0.1:9222`). |
| `NDDEV_BROWSER_CDP_PORT=<port>` | Explicit CDP port override; wins over the sidecar and the backend flag. Out-of-range values are rejected as a config error. |

Implementation: `resolveCdpPort()` in
`packages/browseros-agent/apps/server/src/config.ts`, covered by
`apps/server/tests/config.test.ts`.

Scope: CloakBrowser is a browser, not a proxy. This routes browser automation
(agent + MCP browser tools) only, not arbitrary CLI/network traffic.

## 2. Self-contained fork

The upstream-private `browseros-ai/internal-docs` submodule, its
`sync-internal-docs` workflow, and the `ask-internal` skill were removed so this
public fork clones and builds without upstream-private access.

## 3. Auto-update: staying synced with upstream

The `Upstream Sync` workflow (`.github/workflows/upstream-sync.yml`) runs every
6 hours (and on demand). It merges `browseros-ai/BrowserOS@main` into the fork
`main`:

- **Clean merge** -> pushed straight to `main` (hands-off, fork stays current).
- **Conflict** -> merge aborted, no force-push, an `Upstream sync conflict`
  tracking issue is opened/updated for manual resolution. Fork commits (the
  CloakBrowser routing and the self-contained changes) are always preserved.

### Browser binary self-update (follow-on)

"The browser always auto-updates itself" — the distributed `.app`/`.exe`
updating via an update feed — is a separate infrastructure track owned by the
upstream release workflows (`release-macos.yml`, `release-windows.yml`,
`release-linux.yml`, `updates/`). Shipping a self-updating **nddev-browser
binary** requires building and signing the Chromium fork and hosting an update
feed under NDDev control (code-signing certificates + a distribution host).
This source fork keeps that pipeline's input current; wiring the build/sign/host
side is the remaining infrastructure step, not a source change.
