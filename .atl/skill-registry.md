# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | /Users/allan/.config/opencode/skills/issue-creation/SKILL.md |
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | /Users/allan/.config/opencode/skills/branch-pr/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | /Users/allan/.config/opencode/skills/skill-creator/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage | go-testing | /Users/allan/.config/opencode/skills/go-testing/SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | /Users/allan/.config/opencode/skills/judgment-day/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### issue-creation
- Blank issues are disabled — MUST use a template (bug report or feature request)
- Every issue gets `status:needs-review` automatically on creation
- A maintainer MUST add `status:approved` before any PR can be opened
- Questions go to Discussions, not issues
- Bug Report template includes: Pre-flight Checks, Bug Description, Steps to Reproduce, Expected/Actual Behavior, OS, Agent, Shell
- Feature Request template includes: Pre-flight Checks, Problem Description, Proposed Solution, Affected Area

### branch-pr
- Every PR MUST link an approved issue — no exceptions
- Every PR MUST have exactly one `type:*` label
- Conventional commits format: `type(scope): description` — types: feat, fix, chore, docs, style, refactor, perf, test, build, ci, revert
- Branch naming: `type/description` matching regex `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- Never add "Co-Authored-By" or AI attribution to commits
- Type-to-label mapping: feat→type:feature, fix→type:bug, docs→type:docs, refactor→type:refactor, chore→type:chore, etc.

### skill-creator
- Skills structure: `skills/{skill-name}/SKILL.md` with optional `assets/` and `references/` subdirs
- Frontmatter required: name, description (with trigger keywords), license (Apache-2.0), metadata (author: gentleman-programming, version)
- Critical patterns come FIRST in content
- Include Commands section with copy-paste commands
- Reference local files in references/, not web URLs
- After creating, add to AGENTS.md

### go-testing
- Table-driven tests for multiple test cases with `t.Run(name, func(t *testing.T))`
- Bubbletea TUI: Test Model.Update() directly — send tea.KeyMsg, tea.WindowSizeMsg, etc.
- Use teatest.NewTestModel() for full TUI integration tests
- Golden file testing: compare View() output against saved files in testdata/
- Use t.TempDir() for file operations, mock os/exec with interfaces
- Commands: `go test ./...`, `go test -cover ./...`, `go test -update ./...` (golden files), `go test -short ./...`

### judgment-day
- Launch TWO judges in parallel via delegate (async) — neither knows about the other
- Classify every WARNING: real (normal user can trigger) vs theoretical (requires contrived scenario)
- After fixes applied, re-judge with same parallel protocol
- APPROVED criteria: 0 CRITICALs + 0 confirmed real WARNINGs
- After 2 fix iterations with remaining issues → escalate to user
- Never review code yourself as orchestrator — only coordinate judges
- Always include "**Skill Resolution**: injected/fallback-registry/fallback-path/none" in response

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | /Users/allan/.config/opencode/AGENTS.md | System-level agent conventions (gentle-ai persona, context7, engram protocol) |
| spec.md | /Users/allan/dev/projects/tracker/spec.md | Project requirements document |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.
