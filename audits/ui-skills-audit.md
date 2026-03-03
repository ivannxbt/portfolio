# UI Skills Audit Report (Advisory-Only)

Date: 2026-03-03  
Workspace: `/Users/ivancaamano/Proyectos/portfolio`  
Scope: `/app`, `/components`, `/app/globals.css`

## 1) Rule Matrix (Coverage: pass/fail/n-a)

Legend:

- `blocking` = MUST/NEVER
- `recommended` = SHOULD

| Rule ID | Category    | Rule                                                               | Level       | Status | Evidence                                                                                                                                                                                                                                                                                                                               |
| ------- | ----------- | ------------------------------------------------------------------ | ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| STK-01  | Stack       | Use Tailwind defaults unless custom values already exist/requested | blocking    | pass   | Existing codebase intentionally uses custom tokens/styles broadly                                                                                                                                                                                                                                                                      |
| STK-02  | Stack       | Use `motion/react` for JS animation                                | blocking    | fail   | `framer-motion` imports in [components/ui/button.tsx:6](/Users/ivancaamano/Proyectos/portfolio/components/ui/button.tsx:6), [components/portfolio/clairo-chat.tsx:4](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:4), [lib/animations.ts:8](/Users/ivancaamano/Proyectos/portfolio/lib/animations.ts:8) |
| STK-03  | Stack       | Prefer `tw-animate-css` for entrance/micro animations              | recommended | fail   | Custom animation classes in [app/globals.css:208](/Users/ivancaamano/Proyectos/portfolio/app/globals.css:208) and usage in [components/portfolio-landing.tsx:732](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:732)                                                                                         |
| STK-04  | Stack       | Use `cn` for class logic                                           | blocking    | pass   | `cn` utility present in [lib/utils.ts:4](/Users/ivancaamano/Proyectos/portfolio/lib/utils.ts:4), used in shared inputs/buttons                                                                                                                                                                                                         |
| CMP-01  | Components  | Use accessible primitives for keyboard/focus behavior              | blocking    | fail   | Hand-rolled overlays/menu/dialog-like surfaces in [components/header.tsx:101](/Users/ivancaamano/Proyectos/portfolio/components/header.tsx:101) and [components/portfolio/clairo-chat.tsx:270](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:270)                                                        |
| CMP-02  | Components  | Use project primitives first                                       | blocking    | fail   | Primary surfaces still use raw `input/button` instead of UI primitives, e.g. [components/portfolio/clairo-chat.tsx:505](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:505)                                                                                                                               |
| CMP-03  | Components  | Never mix primitive systems in same surface                        | blocking    | pass   | No evidence of mixed Radix/React-Aria/Base UI within a single interaction surface                                                                                                                                                                                                                                                      |
| CMP-04  | Components  | Prefer Base UI for new primitives                                  | recommended | n-a    | No new primitive creation in this audit phase                                                                                                                                                                                                                                                                                          |
| CMP-05  | Components  | Icon-only buttons need `aria-label`                                | blocking    | pass   | Present in [components/header.tsx:94](/Users/ivancaamano/Proyectos/portfolio/components/header.tsx:94), [components/portfolio/clairo-chat.tsx:245](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:245)                                                                                                    |
| CMP-06  | Components  | Never rebuild keyboard/focus behavior by hand                      | blocking    | fail   | Manual key handlers for chat/panel in [components/portfolio/clairo-chat.tsx:133](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:133)                                                                                                                                                                      |
| INT-01  | Interaction | Use AlertDialog for destructive actions                            | blocking    | fail   | Clear-chat action executes immediately in [components/portfolio/clairo-chat.tsx:330](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:330)                                                                                                                                                                  |
| INT-02  | Interaction | Prefer structural skeletons for loading                            | recommended | pass   | Dedicated skeleton components in [components/ui/skeleton.tsx:17](/Users/ivancaamano/Proyectos/portfolio/components/ui/skeleton.tsx:17)                                                                                                                                                                                                 |
| INT-03  | Interaction | Never use `h-screen`, use `h-dvh`                                  | blocking    | pass   | No `h-screen` usage found                                                                                                                                                                                                                                                                                                              |
| INT-04  | Interaction | Respect safe-area insets for fixed elements                        | blocking    | fail   | Fixed bottom/right surfaces without safe-area padding in [components/portfolio/clairo-chat.tsx:184](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:184) and [components/portfolio/clairo-chat.tsx:273](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:273)                   |
| INT-05  | Interaction | Show errors near action location                                   | blocking    | pass   | Local inline errors in [app/admin/login/page.tsx:68](/Users/ivancaamano/Proyectos/portfolio/app/admin/login/page.tsx:68), [components/admin-client.tsx:603](/Users/ivancaamano/Proyectos/portfolio/components/admin-client.tsx:603)                                                                                                    |
| INT-06  | Interaction | Never block paste in inputs/textareas                              | blocking    | pass   | No paste-blocking handlers found                                                                                                                                                                                                                                                                                                       |
| ANI-01  | Animation   | No animation unless explicitly requested                           | blocking    | fail   | Global/section animations applied broadly, e.g. [components/portfolio-landing.tsx:878](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:878)                                                                                                                                                                    |
| ANI-02  | Animation   | Animate only compositor props                                      | blocking    | fail   | Width animation via inline style in [components/portfolio/clairo-chat.tsx:185](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:185)                                                                                                                                                                        |
| ANI-03  | Animation   | Never animate layout props                                         | blocking    | fail   | Width transitions in [components/portfolio/clairo-chat.tsx:185](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:185)                                                                                                                                                                                       |
| ANI-04  | Animation   | Avoid paint animations except small/local                          | recommended | fail   | Gradient text animation in [app/globals.css:389](/Users/ivancaamano/Proyectos/portfolio/app/globals.css:389)                                                                                                                                                                                                                           |
| ANI-05  | Animation   | Use `ease-out` on entrance                                         | recommended | pass   | Most custom keyframes use ease-out in [app/globals.css:213](/Users/ivancaamano/Proyectos/portfolio/app/globals.css:213)                                                                                                                                                                                                                |
| ANI-06  | Animation   | Interaction feedback <= 200ms                                      | blocking    | fail   | Button transitions set to 300ms in [components/portfolio/clairo-chat.tsx:249](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:249)                                                                                                                                                                         |
| ANI-07  | Animation   | Pause looping animations off-screen                                | blocking    | fail   | Infinite loading/typing loops with no viewport pause in [components/portfolio/clairo-chat.tsx:479](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:479)                                                                                                                                                    |
| ANI-08  | Animation   | Respect reduced motion                                             | recommended | pass   | Reduced-motion handling in [components/theme-selector.tsx:21](/Users/ivancaamano/Proyectos/portfolio/components/theme-selector.tsx:21), [app/globals.css:129](/Users/ivancaamano/Proyectos/portfolio/app/globals.css:129)                                                                                                              |
| ANI-09  | Animation   | No custom easing curves unless requested                           | blocking    | fail   | Custom cubic-bezier in [app/globals.css:379](/Users/ivancaamano/Proyectos/portfolio/app/globals.css:379), custom arrays in [components/portfolio-landing.tsx:117](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:117)                                                                                         |
| ANI-10  | Animation   | Avoid animating large images/full-screen surfaces                  | recommended | fail   | Large/fixed decorative surface transitions in [components/portfolio-landing.tsx:888](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:888)                                                                                                                                                                      |
| TYP-01  | Typography  | `text-balance` on headings                                         | blocking    | fail   | Heading without `text-balance` in [components/portfolio-landing.tsx:547](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:547)                                                                                                                                                                                  |
| TYP-02  | Typography  | `text-pretty` on body copy                                         | blocking    | fail   | Body copy without `text-pretty` in [components/portfolio-landing.tsx:559](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:559)                                                                                                                                                                                 |
| TYP-03  | Typography  | `tabular-nums` for data                                            | blocking    | fail   | Numeric labels/date/meta without `tabular-nums` in [components/project-card-brutal.tsx:43](/Users/ivancaamano/Proyectos/portfolio/components/project-card-brutal.tsx:43)                                                                                                                                                               |
| TYP-04  | Typography  | Prefer truncate/line-clamp in dense UI                             | recommended | pass   | Present in [components/project-card-brutal.tsx:80](/Users/ivancaamano/Proyectos/portfolio/components/project-card-brutal.tsx:80)                                                                                                                                                                                                       |
| TYP-05  | Typography  | Never modify tracking unless requested                             | blocking    | fail   | Extensive custom tracking e.g. [components/admin-client.tsx:551](/Users/ivancaamano/Proyectos/portfolio/components/admin-client.tsx:551)                                                                                                                                                                                               |
| LAY-01  | Layout      | Use fixed z-index scale, no arbitrary z-\*                         | blocking    | fail   | Arbitrary z values in [components/portfolio/clairo-chat.tsx:184](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:184), [components/portfolio/clairo-chat.tsx:273](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:273)                                                         |
| LAY-02  | Layout      | Prefer `size-*` for square elements                                | recommended | fail   | `w-8 h-8` in [components/header.tsx:52](/Users/ivancaamano/Proyectos/portfolio/components/header.tsx:52)                                                                                                                                                                                                                               |
| PRF-01  | Performance | Never animate large blur/backdrop surfaces                         | blocking    | fail   | Heavy blur/backdrop on fixed surfaces in [components/portfolio/clairo-chat.tsx:287](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:287)                                                                                                                                                                   |
| PRF-02  | Performance | Never apply `will-change` outside active animation                 | blocking    | fail   | Persistent `will-change` in [app/globals.css:618](/Users/ivancaamano/Proyectos/portfolio/app/globals.css:618)                                                                                                                                                                                                                          |
| PRF-03  | Performance | Avoid `useEffect` if render logic can replace it                   | blocking    | fail   | Multiple non-essential effects in [components/portfolio-landing.tsx:838](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:838), [components/header.tsx:11](/Users/ivancaamano/Proyectos/portfolio/components/header.tsx:11)                                                                                     |
| DSG-01  | Design      | Never use gradients unless requested                               | blocking    | fail   | Gradients in [components/portfolio-landing.tsx:935](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:935), [app/globals.css:390](/Users/ivancaamano/Proyectos/portfolio/app/globals.css:390)                                                                                                                    |
| DSG-02  | Design      | Never use purple/multicolor gradients                              | blocking    | fail   | Purple/multicolor gradients in [components/portfolio-landing.tsx:935](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:935), [app/[lang]/opengraph-image.tsx:42](/Users/ivancaamano/Proyectos/portfolio/app/[lang]/opengraph-image.tsx:42)                                                                      |
| DSG-03  | Design      | Never use glow effects as primary affordance                       | blocking    | fail   | Glow hover affordance in [components/portfolio-landing.tsx:577](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:577)                                                                                                                                                                                           |
| DSG-04  | Design      | Prefer Tailwind default shadow scale                               | recommended | fail   | Arbitrary shadow tokens in [components/portfolio/clairo-chat.tsx:287](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:287)                                                                                                                                                                                 |
| DSG-05  | Design      | Empty states need one clear next action                            | blocking    | fail   | Chat empty state has no direct CTA control in [components/portfolio/clairo-chat.tsx:383](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:383)                                                                                                                                                              |
| DSG-06  | Design      | Limit accent colors to one per view                                | recommended | fail   | Multi-accent combinations on landing hero/about in [components/portfolio-landing.tsx:935](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:935)                                                                                                                                                                 |
| DSG-07  | Design      | Prefer existing theme/Tailwind tokens before new ones              | recommended | fail   | Repeated custom hex colors (`#1a1a1a`, `#242424`) in [components/portfolio/clairo-chat.tsx:192](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:192), [components/portfolio-landing.tsx:873](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:873)                                  |

## 2) Prioritized Violations Backlog (exact snippets + fixes)

Format:

- `ID` | `Severity` | `Effort`
- `File + snippet`
- `Why it matters`
- `Concrete fix`

### P0 (blocking, high user impact)

1. `V-001` | `P0` | `M`

- File + snippet: [components/portfolio/clairo-chat.tsx:330](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:330)

```tsx
<motion.button onClick={clearMessages} ...>
```

- Why it matters: irreversible destructive action without confirmation risks accidental data loss.
- Concrete fix: wrap clear action in project primitive AlertDialog (or Radix `AlertDialog`) and execute `clearMessages` only on confirm.

2. `V-002` | `P0` | `M`

- File + snippet: [components/portfolio/clairo-chat.tsx:184](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:184)

```tsx
className = "fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] max-w-2xl";
```

- Why it matters: fixed mobile controls can overlap iOS/Android system UI without safe-area support.
- Concrete fix: replace with safe-area-aware utility, e.g. `bottom-[calc(env(safe-area-inset-bottom)+1rem)]`, add side padding from safe-area, and centralize as `safe-fixed-bottom` utility class.

3. `V-003` | `P0` | `M`

- File + snippet: [components/portfolio/clairo-chat.tsx:273](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:273)

```tsx
className = "fixed right-0 top-0 h-full z-[70] w-full md:w-[40%] ...";
```

- Why it matters: arbitrary z-index values create layering bugs and brittle overlays.
- Concrete fix: introduce z-index scale constants (`z-overlay`, `z-modal`, `z-toast`) and replace arbitrary classes across fixed shells.

4. `V-004` | `P0` | `L`

- File + snippet: [components/ui/button.tsx:6](/Users/ivancaamano/Proyectos/portfolio/components/ui/button.tsx:6)

```tsx
import { motion, useReducedMotion } from "framer-motion";
```

- Why it matters: violates mandated animation stack and complicates future UI consistency.
- Concrete fix: migrate imports/usages from `framer-motion` to `motion/react` in shared primitives first; provide compatibility adapter in `lib/animations` during transition.

5. `V-005` | `P0` | `M`

- File + snippet: [components/portfolio-landing.tsx:577](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:577)

```tsx
whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 229, 255, 0.3)" }}
```

- Why it matters: glow-based primary affordance and paint-heavy shadow animation degrade clarity/performance.
- Concrete fix: keep transform-only hover (`scale` or `y`) and use static Tailwind shadow level (`shadow-md`/`shadow-lg`) without animated glow.

6. `V-006` | `P0` | `M`

- File + snippet: [app/globals.css:618](/Users/ivancaamano/Proyectos/portfolio/app/globals.css:618)

```css
.spotlight-orb {
  will-change: transform, opacity;
}
```

- Why it matters: persistent `will-change` can increase memory/paint cost when animation is idle.
- Concrete fix: apply `will-change` only while active (toggle class on interaction/visibility), or remove and rely on transform-only keyframes.

### P1 (blocking, broad consistency risk)

7. `V-007` | `P1` | `M`

- File + snippet: [components/portfolio/clairo-chat.tsx:185](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:185)

```tsx
style={{ width: isFocused ? "95%" : "90%" }}
```

- Why it matters: layout-property animation (`width`) causes reflow and violates animation constraints.
- Concrete fix: keep fixed width and animate transform only (`scale`), or use static responsive breakpoints.

8. `V-008` | `P1` | `M`

- File + snippet: [components/portfolio-landing.tsx:935](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:935)

```tsx
"bg-gradient-to-tr from-teal-600 via-purple-600 to-blue-500";
```

- Why it matters: gradients and purple/multicolor palettes conflict with explicit design constraints.
- Concrete fix: replace with solid tokenized surfaces (`bg-teal-600`, `bg-neutral-*`) and keep one accent color per section.

9. `V-009` | `P1` | `M`

- File + snippet: [components/portfolio/clairo-chat.tsx:287](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:287)

```tsx
"... backdrop-blur-2xl ... shadow-[0_0_90px_rgba(0,0,0,0.6)]";
```

- Why it matters: large blur/backdrop on full-height surfaces is costly and can reduce readability.
- Concrete fix: reduce to non-animated subtle layer (`bg-neutral-950/90`, `shadow-lg`) and remove large blur/glow.

10. `V-010` | `P1` | `S`

- File + snippet: [components/admin-client.tsx:551](/Users/ivancaamano/Proyectos/portfolio/components/admin-client.tsx:551)

```tsx
className = "text-xs uppercase tracking-[0.3em] text-teal-600";
```

- Why it matters: ad-hoc tracking is globally disallowed and creates inconsistent typographic rhythm.
- Concrete fix: remove `tracking-*` except where explicitly approved; use weight/size/case only.

11. `V-011` | `P1` | `S`

- File + snippet: [components/portfolio-landing.tsx:547](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:547)

```tsx
className = "text-5xl md:text-7xl font-bold tracking-tight ...";
```

- Why it matters: headings miss required `text-balance` and include forbidden tracking override.
- Concrete fix: add `text-balance`, remove `tracking-tight`, preserve sizing.

12. `V-012` | `P1` | `S`

- File + snippet: [components/portfolio-landing.tsx:559](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:559)

```tsx
className = "text-lg max-w-2xl mb-12 ...";
```

- Why it matters: paragraph blocks miss required `text-pretty` for readable wrapping.
- Concrete fix: add `text-pretty` to paragraph-style content blocks.

13. `V-013` | `P1` | `S`

- File + snippet: [components/project-card-brutal.tsx:43](/Users/ivancaamano/Proyectos/portfolio/components/project-card-brutal.tsx:43)

```tsx
#{projectNumber}
```

- Why it matters: numeric metadata without `tabular-nums` can jitter alignment in dense cards.
- Concrete fix: add `tabular-nums` to number/date/meta chips.

14. `V-014` | `P1` | `M`

- File + snippet: [components/portfolio/clairo-chat.tsx:479](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:479)

```tsx
repeat: Infinity;
```

- Why it matters: infinite loops without off-screen pause waste CPU/GPU.
- Concrete fix: gate looping animation by visibility (`IntersectionObserver`/presence) and pause when hidden.

15. `V-015` | `P1` | `M`

- File + snippet: [components/header.tsx:101](/Users/ivancaamano/Proyectos/portfolio/components/header.tsx:101)

```tsx
{
  mobileMenu && <div className="fixed inset-0 ...">...</div>;
}
```

- Why it matters: hand-rolled overlay lacks hardened primitive behavior (focus trap, escape semantics, aria state model).
- Concrete fix: replace with single primitive system (`Dialog`/`Sheet`), wire trigger/content semantics, keep existing visuals.

### P2 (recommended and cleanup)

16. `V-016` | `P2` | `M`

- File + snippet: [app/globals.css:389](/Users/ivancaamano/Proyectos/portfolio/app/globals.css:389)

```css
.gradient-text {
  background: linear-gradient(...);
  animation: gradient-shift 8s...;
}
```

- Why it matters: animated gradient text is paint-heavy and violates design defaults.
- Concrete fix: replace with single accent color utility and remove gradient shift animation.

17. `V-017` | `P2` | `S`

- File + snippet: [components/header.tsx:52](/Users/ivancaamano/Proyectos/portfolio/components/header.tsx:52)

```tsx
className = "relative h-8 w-8 ...";
```

- Why it matters: misses square-size shorthand rule, increasing class verbosity.
- Concrete fix: use `size-8` (or project utility) where supported.

18. `V-018` | `P2` | `M`

- File + snippet: [components/portfolio-landing.tsx:888](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:888)

```tsx
className = "fixed inset-0 ... transition-opacity duration-500 ...";
```

- Why it matters: full-screen decorative transitions are costly and exceed guidance for large surfaces.
- Concrete fix: remove/disable transition on full-screen decorative layers; keep static texture.

19. `V-019` | `P2` | `M`

- File + snippet: [components/portfolio/clairo-chat.tsx:383](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx:383)

```tsx
"Send a message to start chatting";
```

- Why it matters: empty state lacks one explicit action control.
- Concrete fix: add explicit CTA button in empty state (`Try prompt`, `Ask about projects`) that seeds input.

20. `V-020` | `P2` | `S`

- File + snippet: [components/portfolio-landing.tsx:873](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx:873)

```tsx
"bg-[#1a1a1a]";
```

- Why it matters: repeated bespoke hex values bypass token system and complicate theme maintenance.
- Concrete fix: swap to tokenized Tailwind classes (`bg-neutral-950` etc.) or theme CSS vars.

## 3) High-Impact Files Reviewed First

Completed detailed review of:

- [components/portfolio-landing.tsx](/Users/ivancaamano/Proyectos/portfolio/components/portfolio-landing.tsx)
- [components/portfolio/clairo-chat.tsx](/Users/ivancaamano/Proyectos/portfolio/components/portfolio/clairo-chat.tsx)
- [components/header.tsx](/Users/ivancaamano/Proyectos/portfolio/components/header.tsx)
- [components/ui/button.tsx](/Users/ivancaamano/Proyectos/portfolio/components/ui/button.tsx)
- [components/ui/input.tsx](/Users/ivancaamano/Proyectos/portfolio/components/ui/input.tsx)
- [components/ui/textarea.tsx](/Users/ivancaamano/Proyectos/portfolio/components/ui/textarea.tsx)
- [components/admin-client.tsx](/Users/ivancaamano/Proyectos/portfolio/components/admin-client.tsx)
- [app/[lang]/loading.tsx](/Users/ivancaamano/Proyectos/portfolio/app/[lang]/loading.tsx)
- [app/[lang]/layout.tsx](/Users/ivancaamano/Proyectos/portfolio/app/[lang]/layout.tsx)

## 4) Phased Remediation Blueprint (Advisory)

### Phase 1: Shared primitives + global tokens/utilities

- Migrate shared animation imports to `motion/react` in `components/ui/*` and `lib/animations.ts`.
- Define canonical z-index scale in one place (e.g. `z-base`, `z-header`, `z-overlay`, `z-modal`, `z-toast`).
- Add safe-area utilities for fixed bars/sheets.
- Add typography utility conventions (`text-balance`, `text-pretty`, `tabular-nums`, no ad-hoc tracking).
- Replace bespoke hex/gradient helpers in global CSS with theme tokens.

### Phase 2: Navigation/shell surfaces

- Refactor header mobile menu to primitive-based dialog/sheet.
- Replace arbitrary z-index and unsafe fixed offsets in header and shell overlays.
- Introduce `min-h-dvh` shell wrappers where full-viewport behavior is expected.

### Phase 3: Complex interactions (chat, cards, loaders)

- Add AlertDialog gate for destructive chat actions.
- Remove layout animations (`width`) and paint-heavy glow/blur transitions.
- Make looping animations visibility-aware and reduced-motion safe.
- Normalize fixed chat surfaces with safe-area + z-scale + tokenized colors.

### Phase 4: Typography + visual consistency

- Apply heading/body/number typography constraints consistently.
- Remove non-approved tracking overrides.
- Reduce accent usage to one accent per view.
- Convert gradient-heavy elements to flat tokenized surfaces.

## 5) Migration Prerequisites (Advisory)

### 5.1 `framer-motion` -> `motion/react`

- Create a compatibility migration layer in `lib/animations` exposing identical variant/transition exports.
- Migrate shared primitives (`button`, `input`, `textarea`) first, then high-traffic components (`portfolio-landing`, `clairo-chat`, `theme-selector`).
- Final step: remove direct `framer-motion` imports and enforce with lint rule.

### 5.2 Fixed z-index scale policy

- Define a single z-index map and document allowed classes.
- Replace all `z-[...]` usages with mapped semantic classes.

### 5.3 Safe-area standard for fixed UI

- Standardize utilities for bottom bars, top headers, side sheets using `env(safe-area-inset-*)`.
- Require these utilities on all `position: fixed` interactive surfaces.

### 5.4 `h-screen`/`min-h-screen` -> dynamic viewport units

- Keep `h-screen` banned.
- Migrate full-height wrappers from `min-h-screen` to `min-h-dvh` for mobile browser UI correctness.

### 5.5 Typography constraints

- Require `text-balance` for headings and `text-pretty` for body copy.
- Require `tabular-nums` for numeric UI.
- Forbid `tracking-*` unless an explicit design exception is documented.

## 6) Public APIs / Interfaces / Types

- No public API/interface/type changes are required in this advisory audit phase.
- Future remediation should preserve current component props unless a breaking change is explicitly documented per component.

## 7) Validation Checklist Against Requested Audit Quality

- Coverage check: `pass/fail/n-a` status provided for every `ui-skills` rule.
- Snippet accuracy: every violation points to concrete file path + line.
- Fix specificity: each violation includes actionable code-level remediation.
- Priority sanity: blocking issues prioritized in `P0/P1` ahead of recommended `P2`.
- Surface completeness: findings include both public-facing UI and admin UI.
