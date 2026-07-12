<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
generator: gds
bundle: 0.1.0-dev
source-commit: c93a1c90d7010a713ac9030f8fbbd9b28e2f15ad
input-digest: sha256:bf9fe3883bdbd4ea4699d62420cf117a66aaf9e53994984e4d3113bd059cdefa
output-digest: sha256:70f4a96fc76ae9e649e7434fa5fec4c7857beab82b05e0ff238864fef989ce0f
edit-source:
  - .gds/repository.yaml
  - policies/base/repository-default.yaml
  - policies/portfolios/fork-default.yaml
  - templates/agents/repository.md.tmpl
  - templates/github-actions/go.yml.tmpl
  - templates/harnesses/claude.md.tmpl
-->
# Claude Code repository contract

## Scope

- GDS repository ID: `repo_01KX8PR6KH9TNXZBWCXQ4MXPNT`.
- Roles: `project`.
- Canonical repository facts: `.gds/repository.yaml`.
- Applied policy bundle: `.gds/bundle.lock.yaml` (`0.1.0-dev`).
- This is a first-class Claude Code projection compiled from the same typed
  inputs as `AGENTS.md`; neither projection is a manual policy source.

## Repository boundaries

- Treat this Git repository as one independent mutation boundary.
- Preserve unrelated dirty changes, branches, worktrees, and submodules.
- Run `gds context --json` before work crosses repository boundaries.
- Do not edit generated projections; change the declared canonical input and
  regenerate.

## Safety

- External writes require explicit approval: `true`.
- Generated projection edits: `forbidden`.
- Private parent context persistence: `forbidden`.
- Visibility: `public`; data: `public`.

## Verification commands

- Test: `cd packages/browseros-agent && bun run lint`.
- Test: `cd packages/browseros-agent && VITE_PUBLIC_BROWSEROS_API=http://localhost:3000 bun run --cwd apps/app wxt prepare`.
- Test: `cd packages/browseros-agent && bun run --cwd apps/app codegen`.
- Test: `cd packages/browseros-agent && bun run typecheck`.
- Test: `cd packages/browseros-agent && bun run fallow`.
- Test: `cd packages/browseros-agent && bun run test`.

## Claude workflow routing

- Active skill profiles: `core`.
- Load procedural detail from the applicable installed GDS skill projection or
  plugin only when the task matches it.
- Destructive workflows remain explicit-only and still require their concrete
  plan and approval gates.
- Treat documentation and Serena memories as derived evidence, never mutation
  authority.

## Done

- Required checks pass or are explicitly reported `NOT_PROVEN`.
- Every affected Git boundary and remote result is classified.
- No secret, private-context leak, unrelated change, or unapproved projection
  drift is introduced.
