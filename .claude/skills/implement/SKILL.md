---
name: implement
description: Build a decided proposal from apps/docs/decisions/ and record back into the doc what the build actually taught you. Use after decisions have been accepted in a proposal document, or when the user says "implement 0003" or "build the decided proposal".
---

# Implement

Build what a decision document decided, then close the loop by writing the outcome back
into that document.

## 1. Load the decision

Read `apps/docs/decisions/NNNN-slug.html` — the prose and the `#decision-record` JSON.

- If `status` is not `"decided"`, stop and say so. An undecided doc means `propose`
  hasn't finished; do not guess the recommended options.
- If a decision is still `OPEN` or `REJECT`, stop. Ask for that one fork rather than
  building around it.

## 2. Build to the decision, not to your taste

Follow the accepted options exactly, including anything in the notes. Read
`../propose/checklist.md` for the conventions the code has to satisfy — token layering,
`as` and spacing prop rules, focus ring, file layout, index export.

If while building you find an accepted option is genuinely wrong — it doesn't compile,
it breaks a repo rule, it contradicts a prior decision — **stop and say so**. Do not
silently substitute a different option. That divergence is exactly what the document
exists to capture.

## 3. Verify

Run the repo's own guards before claiming completion:

```
pnpm turbo typecheck test
```

`api.types.test.tsx`, `refs.test.tsx` and `stylesheet.test.ts` catch most convention
misses. Report failures with their output rather than describing them.

## 4. Write back what the build taught you

This is the part that makes the archive worth keeping. Add an **As built** section to
the decision document:

- Files added or changed, as a short list.
- Anything the proposal got wrong, missed, or under-specified — stated plainly. If the
  proposal was accurate, say that; a clean run is useful signal too.
- Any new question the build surfaced that deserves its own future proposal.

Then update `#decision-record`: `status` to `"built"`, `built` to today's date. Flip the
masthead pill to `status-built` and update the index row.

## Superseding

When a later decision overturns an earlier one, do not edit the old document's outcome.
Set its status to `"superseded"`, add a line in its masthead pointing at the new doc,
and note the reversal in the new doc's Context. The visual history only has value if
old decisions stay readable as they were made.
