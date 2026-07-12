<!--
GENERATED FILE - DO NOT EDIT DIRECTLY
generator: gds
bundle: 0.1.0-dev
source-commit: e62fc6883e1a15a5bf7a607251f3443085a69807
input-digest: sha256:b35462bef8758ffee3fbaaa8798bb15e337167865535338b4c259de4050a966a
output-digest: sha256:2b70b06c9a21e9903f7e5c9572a5851e81749d108430726e44fb6251cfbddeec
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

- No repository-owned verification command is declared; report it as `NOT_PROVEN`.

## Agent routing

- Active skill profiles: `core`.
- Use on-demand skills for procedures; do not duplicate them here.
- Treat docs and memories as derived evidence, not mutation authority.

## Done

- Required verification is complete or explicitly `NOT_PROVEN`.
- Git state and every affected repository boundary are classified.
- No private data, secret, or unapproved generated drift is introduced.
