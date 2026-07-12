# Fork lifecycle

## Current state

`NDDev-it-com/nddev-browser` is an owned maintained-patch fork of
`browseros-ai/BrowserOS`. The current default branches have no common ancestor,
so an ordinary merge cannot synchronize them safely.

Automatic upstream synchronization is quarantined. The repository must not:

- force-update the owned default branch;
- merge unrelated histories;
- discard fork-specific commits;
- claim that the upstream relationship is synchronized.

## Recovery decision

Before upstream integration resumes, create an explicit GDS fork plan that:

1. inventories every owned commit and required patch;
2. selects exact patches to transplant onto a fresh upstream base;
3. validates the rebuilt repository and fork-specific behavior;
4. preserves a recoverable reference to the current history;
5. obtains approval for any default-branch replacement;
6. verifies provider and local topology after apply.

Until that plan is approved, `fork.policy: maintained-patch` remains canonical
and the sync workflow is informational only.

## Fork-only automation

The inherited upstream CLA workflow is not valid in this fork because its
signature store and token belong to upstream infrastructure. CLA enforcement
will occur in the upstream repository when a contribution is submitted there.

The inherited Claude workflow is also disabled in this fork until an owned App
installation, credential, permission set, and immutable action pin are reviewed
and configured explicitly.
