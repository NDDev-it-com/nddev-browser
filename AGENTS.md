<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
generator: gds
bundle: 0.1.0-dev
source-commit: c93a1c90d7010a713ac9030f8fbbd9b28e2f15ad
input-digest: sha256:bf9fe3883bdbd4ea4699d62420cf117a66aaf9e53994984e4d3113bd059cdefa
output-digest: sha256:c55170d4a8b9876154d85acf397ebd85ab004011f469a031ce91cb0fdee24c97
edit-source:
  - .gds/repository.yaml
  - policies/base/repository-default.yaml
  - policies/portfolios/fork-default.yaml
  - templates/agents/repository.md.tmpl
  - templates/github-actions/go.yml.tmpl
  - templates/harnesses/claude.md.tmpl
-->
# GDS repository contract

## Scope

- Repository ID: `repo_01KX8PR6KH9TNXZBWCXQ4MXPNT`.
- Roles: `project`.
- Canonical repository facts: `.gds/repository.yaml`.
- Applied bundle: `.gds/bundle.lock.yaml` (`0.1.0-dev`).
- Compiled policy: `.gds/compiled-policy.json`.

## Boundaries

- This Git repository is one independent mutation boundary.
- Preserve unrelated branches, worktrees, submodules, and dirty changes.
- Resolve cross-repository work with `gds context --json` before acting.
- Generated files are projections; change their canonical inputs and regenerate.

## Safety

- External writes require explicit approval: `true`.
- Generated projection edits: `forbidden`.
- Private parent context persistence: `forbidden`.
- Visibility contract: `public`; data classification: `public`.

## Development

- Test: `cd packages/browseros-agent && bun run lint`.
- Test: `cd packages/browseros-agent && VITE_PUBLIC_BROWSEROS_API=http://localhost:3000 bun run --cwd apps/app wxt prepare`.
- Test: `cd packages/browseros-agent && bun run --cwd apps/app codegen`.
- Test: `cd packages/browseros-agent && bun run typecheck`.
- Test: `cd packages/browseros-agent && bun run fallow`.
- Test: `cd packages/browseros-agent && bun run test`.

## Agent routing

- Active skill profiles: `core`.
- Use on-demand skills for procedures; do not duplicate them here.
- Treat docs and memories as derived evidence, not mutation authority.

## Done

- Required verification is complete or explicitly `NOT_PROVEN`.
- Git state and every affected repository boundary are classified.
- No private data, secret, or unapproved generated drift is introduced.
