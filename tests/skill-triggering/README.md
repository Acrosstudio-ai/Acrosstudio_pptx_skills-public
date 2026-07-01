# Skill-triggering tests

Skill triggering is verified in two layers.

## Layer 1 — CI-safe vocabulary checks (this directory)

`triggering.test.mjs` asserts that the trigger VOCABULARY for each skill is
present in that skill's `description` frontmatter. This is deterministic, needs
no live model, and runs in unit CI.

- **Test A** discovers every skill under `skills/` and fails if any skill has no
  entry in the `TRIGGERS` map. This enforces coverage: each new skill (Plans
  2/3) must register its triggers.
- **Test B** reads each registered skill's description and asserts that every
  expected trigger substring is included.

If you add a skill, add its trigger substrings to the `TRIGGERS` map.

## Layer 2 — LLM-in-the-loop behavioral triggering (not in unit CI)

Whether the model actually invokes the skill on a representative prompt is a
behavioral property that requires a live model. Those tests are authored per
skill using the superpowers `writing-skills` baseline -> pass method (write a
representative prompt, confirm the skill is NOT triggered by the baseline, add
the trigger vocabulary, then confirm it IS triggered). Because they require a
live model, they are not run in unit CI.
