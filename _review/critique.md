# Website Review -- Round 6

**Date:** 2026-04-23

---

## Status of Round 5 Issues

| R5 # | Issue | Status |
|------|-------|--------|
| 1 | Empty href on Dissertation Award | FIXED -- `url:` key removed from `_data/awards.yml` |
| 2 | Publications not sorted reverse-chronologically within themes | FIXED -- `_pages/publications.html` line 33 now uses `sort: "year" | reverse` |
| 3 | ICLR 2026 workshop news stale/premature | FIXED -- news items are now separate (ICLR 2026 Apr, ICML 2026 Jul), text is appropriate for each |
| 4 | `aria-controls` references non-existent id | FIXED -- `_includes/news.html` line 4 now has `id="news-list"` on the `<ul>` |
| 5 | Chronos-2 not marked as selected | STILL OPEN -- `_data/publications.yml` line 46: `selected: false`. Judgment call, likely intentional (middle author). |
| 6 | Distinguished Dissertation not first among 2025 awards | FIXED -- on the rendered homepage, Distinguished Dissertation Award appears first among the 2025 awards |
| 7 | "Incoming Ph.D. Student" labels may be stale | STILL OPEN -- `_data/students.yml` lines 5 and 12 still say "Incoming Ph.D. Student." If they started Fall 2025, they are now enrolled PhD students as of April 2026 |
| 8 | `$text-light` fails WCAG AA contrast | FIXED -- `_sass/_variables.scss` line 10 now defines `$text-light: #6b7280` (approx 4.6:1 ratio), with comment confirming WCAG AA compliance |
| 9 | Photo appears before text on mobile | FIXED -- `_layouts/home.html` now uses `order-1` for text column, `order-2` for photo column, with `order-md` classes for desktop layout. Verified in rendered HTML: text is `col-md-8 order-1`, photo is `col-md-4 order-2`. Text appears first on all screen sizes. |
| 10 | Amazon Science talk has no link | STILL OPEN -- `_data/service.yml` line 68 still has no URL. May be intentional (internal talk). |
| 11 | Line-height inconsistency | PARTIALLY ADDRESSED -- profile bio now uses 1.7 line-height (was 1.75). Some secondary text still at 1.4-1.55 (pub entries, award descriptions, mentee topics). This is acceptable as a hierarchy choice. |
| 12 | Footer omits CV and Semantic Scholar links | STILL OPEN -- footer has 5 icons vs header's 7. Likely intentional. |

**Summary:** 7 of 12 nice-to-have/must-fix items from Round 5 are resolved. 5 remain open but are all judgment calls or minor.

---

## Page Ratings

| Page | Score | Change from R5 |
|------|-------|-----------------|
| Homepage (`/`) | 9/10 | +0.5 (broken link fixed, mobile photo order fixed) |
| Publications (`/publications/`) | 9/10 | +1.5 (sorting fixed, clean thematic grouping) |
| Awards (`/awards/`) | 8.5/10 | +0.5 (empty href fixed) |
| Mentorship (`/mentorship/`) | 8.5/10 | -- (unchanged) |
| Service (`/service/`) | 8/10 | -- (unchanged) |

---

## NEW MUST FIX

### 1. Homepage "Evaluation & Benchmarks" label vs publications page "Evaluation Science" label

The homepage selected publications section (`_layouts/home.html` line 36) hard-codes the theme list as:

```
"Agents,Foundation Models,Evaluation & Benchmarks"
```

This uses `selected_theme` from `_data/publications.yml`, where the evaluation papers have `selected_theme: "Evaluation & Benchmarks"`.

The publications page (`_pages/publications.html` line 14) uses the `theme` field:

```
"Agents,Foundation Models,Evaluation Science,Healthcare & Education"
```

So the same group of papers is labeled "Evaluation & Benchmarks" on the homepage and "Evaluation Science" on the publications page. A visitor who reads both sees two different names for the same research area.

**Fix:** Pick one label and use it in both places. Either:
- Change `_layouts/home.html` line 36 to use `"Evaluation Science"` and update `selected_theme` values in `_data/publications.yml` to match, OR
- Change `_pages/publications.html` line 14 theme name from `"Evaluation Science"` to `"Evaluation & Benchmarks"` and update `theme` values

### 2. Homepage `pub-description` color breaks visual hierarchy

**File:** `_sass/_homepage.scss` line 155

```scss
.pub-description {
  font-size: 0.85rem;
  color: $text-color;  // #1e293b — same as title and authors
```

On the publications page, the equivalent class `.pub-entry-description` uses `color: $text-muted` (`_sass/_publications.scss` line 125). The homepage descriptions have the same visual weight as titles, making them compete for attention instead of serving as supporting text.

**Fix:** Change `_sass/_homepage.scss` line 155 to:
```scss
  color: $text-muted;
```

---

## NEW NICE TO HAVE

### 3. Mentorship intro text uses `$text-muted` while it is primary content

**File:** `_sass/_pages.scss` line 179

```scss
.mentorship-intro {
  font-size: 0.95rem;
  line-height: 1.7;
  color: $text-muted;
```

The mentorship intro paragraph is the main content a visitor reads first on the page. Using `$text-muted` (#64748b) makes it feel like a subtitle or caption. The homepage bio paragraph uses `$text-color` (#1e293b). For consistency and readability, the mentorship intro should also use `$text-color`.

### 4. Mentee topic italic at small size

**File:** `_sass/_pages.scss` line 254

```scss
.mentee-topic {
  font-size: 0.87rem;
  color: $text-color;
  font-style: italic;
```

The topic is the most interesting line for a reader scanning mentee cards ("what did this person work on?"). Italic at 0.87rem is small and low-contrast against normal-weight text. Consider removing `font-style: italic` or bumping to `0.9rem`.

### 5. Footer social links have circle hover backgrounds; homepage social links do not

**File:** `_sass/_footer.scss` lines 30-33

```scss
&:hover {
  color: $primary;
  background-color: $primary-light;  // circle background appears on hover
}
```

The homepage social links (`_sass/_homepage.scss` lines 46-53) only change color on hover with no background. Per the design intent of "plain icons, no circle backgrounds," the footer hover background creates an inconsistency. Removing `background-color: $primary-light` from `_sass/_footer.scss` line 33 would make both consistent.

### 6. "Incoming Ph.D. Student" labels are likely stale

**File:** `_data/students.yml` lines 5 and 12

Both current mentees are labeled "Incoming Ph.D. Student, Robotics Institute, Carnegie Mellon University." If they started Fall 2025, they have been enrolled for ~8 months and should be "Ph.D. Student" without the "Incoming" prefix.

### 7. Single-venue talk group looks sparse

**File:** `_data/service.yml` lines 67-69

The "Introduction to DevOps, AWS Agentic AI" talk group has only one venue (Amazon Science, Apr 2025). The visual format -- a group heading with left border, followed by a single bullet -- allocates more chrome to the container than to the content. This will naturally resolve as more talks are given. No action needed now, but if the list stays at one item for a while, consider inlining it or merging it into a "Recent Talks" group.

### 8. Talk group `border-left` hover transition

**File:** `_sass/_pages.scss` lines 406-414

The talk group left border transitions from `$border-color` (#e2e8f0) to `$primary` (#2563eb) on hover. The color jump is large. A subtler intermediate like `rgba($primary, 0.4)` would make the transition less jarring, but this is purely aesthetic preference.

### 9. No mobile padding reduction for talk groups

**File:** `_sass/_pages.scss` lines 406-415

Talk groups use `padding: 1rem 1.25rem` with a 3px left border. On a 320px screen, the combined left inset (3px + 1.25rem = ~23px) is ~7% of viewport width. Adding a mobile breakpoint to reduce to `padding: 0.75rem` below 575px would give more room for text.

---

## DESIGN REVIEW (Website Designer Lens)

### What's Working Well

1. **Container width (960px)** is appropriate for text-heavy academic content. Not too wide, not cramped.

2. **Sticky navbar** with `backdrop-filter: blur(8px)` and scroll shadow is polished. The translucent background reads well against content underneath.

3. **Sticky theme navigation** on the publications page is excellent UX. Pill-style links with scroll-spy highlighting, gradient fade hint for horizontal scroll on narrow screens, and `position: static` on mobile to save vertical space.

4. **Workshop organization cards** on the service page are the strongest design element on the site. The teal stat badges (`$accent` + `$accent-light`) provide visual interest without being garish. The "Accepted Papers" pill link is functional and compact.

5. **Section heading accent mixin** (`_sass/_variables.scss` lines 50-66) with the blue `::after` pseudo-element provides consistent visual anchoring on subpages. The homepage's simpler `section-heading` (no accent) creates an appropriate hierarchy distinction.

6. **Typography hierarchy** is well-calibrated:
   - Page titles: 1.5rem / 700 weight
   - Section headings: 1.15-1.2rem / 700 weight
   - Body: 1rem / 1.7 line-height
   - Pub titles: 0.93rem / 600 weight
   - Metadata: 0.82-0.87rem
   - Links/badges: 0.75rem

7. **Color palette** is restrained: `$primary` blue for links, `$text-color` warm dark slate for content, three tiers of gray text, `$accent` teal used only for placements and stats. Badge colors (amber spotlight, green best-paper, blue oral) are distinct.

8. **Print styles** (`_sass/_base.scss` lines 99-111) hide navbar, footer, social links, and news toggle. Good for printing the publications page.

### Observations

- The `border-light` (#f1f5f9) separator between pub items, award cards, and news items is very subtle -- almost invisible on some monitors. This is intentional (Barron-style near-zero visual separation), but on a non-retina display it may look like no separator at all.

- Source Sans 3 variable font with weight range 300-900 gives full flexibility but adds font file weight. The site only uses 500, 600, and 700 weights. Specifying `wght@500;600;700` in the Google Fonts URL instead of `300..900` would reduce load.

---

## RECRUITER / HIRING MANAGER REVIEW

### Impact Within 10 Seconds

The homepage delivers. First paragraph: "I build AI agents... AWS DevOps Agent." Second paragraph: "MOMENT, ICML 2024, 2.5M+ downloads." Third paragraph: "Ph.D. in Robotics, Carnegie Mellon, Distinguished Dissertation Award." That is role, product, research impact, and credentials in three short paragraphs.

### Publication Selection

The homepage selected publications cover three themes with 7 papers:
- **Agents (2):** SpIDER and TimeSeriesGym -- both preprints, which is the weakest section venue-wise but demonstrates the current industry research direction
- **Foundation Models (2):** MOMENT (ICML 2024) and Representations paper (ICML 2025) -- two consecutive ICML papers, strong
- **Evaluation & Benchmarks (3):** TimeSeriesExamAgent (ICLR 2026), AQuA (NeurIPS 2023), Unsupervised Model Selection (ICLR 2023 Spotlight) -- three top-venue papers spanning 3 years

Healthcare & Education papers are deliberately excluded from the homepage selection. This is the right call for someone positioned as an AI agents / foundation models researcher in industry. The full list is on the publications page for those who dig deeper.

### News: Momentum Story

The visible 5 items (Jul 2026 to Oct 2025) show: workshop organizing at two top venues, ICLR 2026 acceptance, Chronos-2 with 11M downloads, and ICML workshop success. Expanding reveals the full arc from PhD start (2020) through fellowship, internships, ICLR Spotlight, MOMENT release, Google Research, dissertation defense, to AWS. Clean trajectory.

### What's Not Present (Noting, Not Prescribing)

- No citation count or h-index
- No teaching section
- No blog or technical writing
- No patent information

These are all reasonable omissions for the target audience (industry research hiring, potential collaborators, prospective mentees).

---

## SUMMARY OF ALL OPEN ITEMS

**Must fix (2 items):**

| # | Issue | File(s) |
|---|-------|---------|
| 1 | "Evaluation & Benchmarks" vs "Evaluation Science" label mismatch | `_layouts/home.html:36`, `_pages/publications.html:14`, `_data/publications.yml` |
| 2 | Homepage `pub-description` uses `$text-color` instead of `$text-muted` | `_sass/_homepage.scss:155` |

**Nice to have (7 new + 2 carried from R5):**

| # | Issue | File(s) |
|---|-------|---------|
| 3 | Mentorship intro uses `$text-muted` for primary content | `_sass/_pages.scss:179` |
| 4 | Mentee topic italic at 0.87rem is small | `_sass/_pages.scss:254` |
| 5 | Footer hover has circle background; homepage social links do not | `_sass/_footer.scss:33` |
| 6 | "Incoming Ph.D. Student" labels likely stale | `_data/students.yml:5,12` |
| 7 | Single-venue talk group looks sparse | `_data/service.yml:67-69` |
| 8 | Talk group left-border hover transition is abrupt | `_sass/_pages.scss:413` |
| 9 | No mobile padding reduction for talk groups | `_sass/_pages.scss:406-415` |
| R5-5 | Chronos-2 not selected (likely intentional) | `_data/publications.yml:46` |
| R5-12 | Footer omits CV and Semantic Scholar links (likely intentional) | `_includes/footer.html` |
