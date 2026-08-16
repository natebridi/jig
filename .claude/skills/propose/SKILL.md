---
name: propose
description: Work a Jig change up into a visual options document at apps/docs/decisions/ before any code is written — a new component, a token change, an API refactor. Renders each open decision as accept/reject options with live specimens, and produces a pasteable decision record. Use when the user says "propose", "let's work through", or asks to add a component or make a change with real design forks in it.
---

# Propose

Turn a task into a decision document. **This skill does not write component code.**
It ends with a document and a summary; implementation happens later via `implement`.

## 1. Research before proposing

Read `checklist.md` in this skill directory and walk it against the actual repo.

- Find the nearest existing precedent and read it properly. For a new component that
  usually means `packages/components/src/button/` — `.tsx`, `.css.ts` and `index.ts`.
- Read the token layer that the change touches: `packages/tokens/src/primitives/` and
  `packages/tokens/src/semantics/`.
- Check `apps/docs/decisions/index.html` for earlier decisions that constrain this one.
  A proposal that contradicts a Decided doc must say so and link it.

**If the proposal involves a third-party package, verify it against the registry —
never from memory.** Model knowledge of package names, versions and release cadence is
routinely stale, and a proposal built on a stale fact wastes the reviewer's time.

```
npm view <pkg> version dist-tags deprecated dependencies peerDependencies peerDependenciesMeta
npm view <pkg> time --json     # real release cadence, not a vibe
```

- **Read the `deprecated` field first.** Renamed packages keep publishing under the old
  name and the old name's version history looks frozen. A "stalled" package is far more
  often a renamed one.
- Check `peerDependenciesMeta` before describing a peer as an install burden — optional
  peers cost the consumer nothing.
- Quote real sizes and dates in the document, and say where they came from.

## 2. Separate what is settled from what is open

This is the step that makes the documents worth reading.

- If precedent, a repo rule, or a prior decision answers a question, it is **settled**.
  It goes in the "Already settled by precedent" list, one line, with the rule cited.
- Only genuine forks become decision blocks. **Aim for 2–5.** More than five means
  things that follow from precedent are being dressed up as choices.
- Every decision needs at least two options that a reasonable person could pick, and
  exactly one marked `Recommended`. Never present an option you would not ship.
- Never propose something a repo rule forbids (see `checklist.md`) as a live option.

## 3. Write the document

Copy `template.html` to `apps/docs/decisions/NNNN-slug.html` — zero-padded four digits,
next in sequence, kebab slug (`0003-input-control-height.html`).

Fill in: title, standfirst, date, decision count, the Context section, the settled list,
and one `.decision` block per fork. Delete the template's example blocks.

**Rules for the document:**

- **Show, do not describe.** Every option needs a real specimen in its `.specimen`
  frame — actual markup styled with the actual token values, an inline SVG, a rendered
  ramp, real swatches. "A 32px tall control with 8px padding" is a failure; the control
  itself is the point. Copy real values out of the token source rather than guessing.
- Single self-contained file. No external CSS, fonts, scripts or images — it has to
  work opened straight from disk as `file://`.
- Do not restyle the template. The house style is shared across all decision docs and
  matches `apps/docs/build-pipeline.html`.
- Keep the existing light/dark blocks intact; specimens must be legible in both.
- Wide specimens scroll inside `.specimen`; the page never scrolls horizontally.
- Set `data-decision` on each block and `data-option` / `data-label` on each option —
  the record generator reads them.
- Update the JSON in `#decision-record`: `doc` matches the filename stem, `status`
  stays `"proposed"`, and `decisions` lists each decision id with its options.

Then add a row to `apps/docs/decisions/index.html`.

## 4. Hand it back

Report: the file path, and one line per decision naming the fork and the recommendation.
Tell the user to open the file, accept or reject, hit **Copy decisions**, and paste the
block back into the chat.

Do not start implementing. Do not ask which option they prefer in chat — the document
is the interface.

## Applying a returned record

When the user pastes a `jig-decision-record v1` block:

1. Write the outcome into the document itself, as an `.outcome` block at the end of each
   decision. Static markup — `localStorage` only exists on the machine that clicked, so
   the durable record has to be in the file. Each decision keeps all its options; the
   history is the point. State what was chosen and quote any note verbatim.
2. **If a note corrects a fact the document argued from, fix the document, not just the
   outcome.** Wrong figures and wrong timelines in the body are what make an archive
   untrustworthy a year later. Correct the prose and the specimens, and say in the
   outcome that the basis changed — including when the choice itself still stands.
3. Update `#decision-record`: `status` to `"decided"`, `decided` to today's date, and
   each decision's outcome and note.
4. Flip the masthead pill to `status-decided` and update the index row.
5. If any decision came back `REJECT` or `OPEN`, or a note asks for something not on
   offer, **iterate instead of proceeding** — revise that decision block with new
   options, set `status` back to `"proposed"`, and hand it back.
6. Once everything is accepted, say the doc is ready and offer `implement`.
