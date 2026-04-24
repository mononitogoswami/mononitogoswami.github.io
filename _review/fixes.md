# Fixes Log

## 2026-04-23 — Critique Response Fixes

### Accessibility
1. Added `aria-label` to all icon-only links in `_includes/social-links.html` and `_includes/footer.html`
2. Added skip-to-content link in `_layouts/default.html` (`<a href="#main-content" class="visually-hidden-focusable">`)
3. Added `id="main-content"` to `<main>` element
4. Added `aria-expanded` and `aria-controls` to news toggle button

### CSS/SCSS
5. Fixed dead CSS in `_sass/_base.scss` — removed duplicate `display: inline-block` and `border-bottom` declarations in `.section-heading`
6. Moved inline `<style>` from `_includes/news.html` into `_sass/_homepage.scss` (`.news-hidden`, `.news-show`)
7. Added `@media print` rules to `_sass/_base.scss` — hides navbar, footer, social links when printing
8. Made publications theme nav non-sticky on mobile (`@media max-width: 767px`) in `_sass/_publications.scss`
9. Added right-edge fade gradient to theme nav for scroll affordance
10. Added mobile stacking for news items (`@media max-width: 575px`) in `_sass/_homepage.scss`

### HTML Structure
11. Extracted badge rendering into shared `_includes/pub-badge.html` — used by both `_includes/publication-entry.html` and `_layouts/home.html`
12. Removed global `function toggleNews()` from `_includes/news.html` — replaced with IIFE event listener

### CV Page (`_pages/cv.html`)
13. Added dates to all education entries (2020-2025 for PhD, 2014-2018 for B.Tech)
14. Added dates to all experience entries (Jun 2025-Present, May-Dec 2024, May 2022-Aug 2023)
15. Fixed `.cv-entry-date` misuse — line 34 had a role description in a date element, now uses `.cv-entry-detail`
16. Added `.cv-entry-header` flex layout for title + date alignment
17. Removed "(formerly Delhi College of Engineering)" parenthetical

### Content De-slop
18. Tightened mentorship intro — removed "I have been fortunate", "some of the most rewarding work"
19. Tightened award descriptions — removed "one of the premier", "Awarded to an outstanding", etc.
20. Tightened workshop descriptions — removed "Advancing context-informed...", "bridging...cross-modal synergies"
21. Tightened MOMENT description — removed "demonstrating the effectiveness of"
22. Tightened TimeSeriesExamAgent description — more specific, less generic

### Config
23. Fixed `og:image` — changed `og_image` key to `image` (what jekyll-seo-tag actually reads)
24. Fixed SEO description — replaced `|` with `·` (YAML-safe)
25. Excluded `_review/` from Jekyll build

### Pending (link verification agent running)
- Verifying all external URLs across publications, service, awards, students
- Finding personal websites for students (replacing LinkedIn where possible)
- Fixing Distinguished Dissertation Award link in bio
- Searching for thesis defense YouTube video

## 2026-04-23 — Second Critique Response Fixes

### SCSS Architecture
1. Extracted shared `@mixin section-heading-accent` into `_sass/_variables.scss` — DRYs up the blue accent underline pattern
2. Replaced 6 duplicated `::after` blocks with mixin calls in `_sass/_base.scss`, `_sass/_publications.scss`, `_sass/_pages.scss` (awards, mentorship, service, CV sections)

### CSS Fixes
3. Added `max-width: 100%`, `height: auto`, `aspect-ratio: 1` to `.profile-photo` in `_sass/_homepage.scss` — prevents overflow on very narrow screens (<360px)

### HTML Fixes
4. Fixed double-dash year ranges on mentorship page — added Liquid `replace` filter in `_pages/students.html` to convert ` -- ` to ` &ndash; ` for proper en-dash rendering
5. Added description display to publication entries — `_includes/publication-entry.html` now renders `pub.description` field when present, with new `.pub-entry-description` style in `_sass/_publications.scss`

### Content Fixes
6. Fixed publications count on CV page — changed "30+" to "40+" in `_pages/cv.html` to match publications page intro
7. Clarified publications intro text — changed "Selected publications from a portfolio of 40+ papers" to "Selected from 40+ publications" in `_pages/publications.html`
8. Added paper link for "Discriminating Cognitive Disequilibrium" (AAAI 2020) → `https://ojs.aaai.org/index.php/AAAI/article/view/5378`
9. Added paper link for "Using Weakly Supervised ML to Label Atrial Fibrillation" (Circulation 2022) → `https://www.ahajournals.org/doi/abs/10.1161/circ.146.suppl_1.10198`

### Not Fixed (require user input)
- 4 student LinkedIn links (Malgorzata, Nina, Chalisa, Arnab) — verified no personal websites found for any of them
- CV page sparseness (needs user decisions on skills, teaching, expanded descriptions)

## 2026-04-23 — Third Critique Response + User Direction Fixes

### Bio Rewrite (Option C: Agents-First, Forward-Looking)
1. Rewrote homepage bio in `_pages/index.html` — agents-first framing per user's direction. Leads with "I build AI agents that reason reliably over complex real-world data." Names foundation models, evaluation science, and agents as three pillars. Includes software engineering and healthcare as domain breadth. "Science of agents" used as sub-phrase: "what I think of as the *science of agents*."

### Homepage Content
2. Added SpIDER to homepage selected publications — `_data/publications.yml`: set `selected: true`, `selected_theme: "Agents"`, added description. Agents group now has 2 papers (TimeSeriesGym + SpIDER).
3. Confirmed awards stays off navbar per user decision (already the case in `_data/navigation.yml`).

### Bug Fixes
4. Fixed CV page awards CSS bug — `_pages/cv.html`: changed `.award-list`, `.award-item`, `.award-year`, `.award-text` to the `-compact` variants that have actual SCSS rules in `_sass/_homepage.scss`.
5. Fixed award description factual error — `_data/awards.yml`: changed "Best paper among workshop submissions" to "Recognized among top workshop submissions" for the Honorable Mention.
6. Updated CMLH Fellowship description — `_data/awards.yml`: added "82 fellowships total across all years, with cohorts of ~7 fellows per themed cycle" based on CMLH website data.
7. Updated CV research interests — `_pages/cv.html`: changed to "AI agents for real-world reasoning, foundation models, evaluation science for AI systems, clinical AI" to match new framing.

### Mobile Responsiveness
8. Added `@media (max-width: 575px)` rules to `_sass/_pages.scss` for `.mentee-header`, `.cv-entry-header`, `.award-major-header`, `.award-paper-header` — stacks flex rows vertically on narrow screens, removes left margins on date/year elements, removes description left-padding.

## 2026-04-23 — Fourth Round Fixes (Remaining Critique Items)

### Publication Descriptions
1. Added description to Chronos-2 (`_data/publications.yml`)
2. Added description to JoLT (`_data/publications.yml`)
3. Added description to Identifying Sepsis Subphenotypes (`_data/publications.yml`)
4. Added description to Counterfactual Phenotyping (`_data/publications.yml`)
5. Added description to Classifying Unstructured Clinical Notes (`_data/publications.yml`)
6. Added description to Using Weakly Supervised ML to Label AFib (`_data/publications.yml`)
7. Added description to Using Weak Supervision and Data Programming (`_data/publications.yml`)
8. Added description to Federated Learning with Heterogeneous Labels (`_data/publications.yml`)
9. Added description to Discriminating Cognitive Disequilibrium (`_data/publications.yml`)

All 15 publications now have descriptions (Sepsis Subphenotypes removed — paper doesn't exist).

### Service Page
10. Changed Panels section from heavy `.service-card` treatment to lightweight `.service-list` format in `_pages/service.html` — matches Reviewing section style, appropriate for 2-item list

### Removed
11. Removed Sepsis Subphenotypes paper from `_data/publications.yml` — user confirmed this paper doesn't exist
12. Removed CV page (`_pages/cv.html`) — redundant with info on homepage/publications/awards; PDF download already in social links bar on every page
13. Removed CV from navbar in `_data/navigation.yml`
14. Removed all CV-specific SCSS from `_sass/_pages.scss` (`.cv-section`, `.cv-download-btn`, `.cv-entry*`, `.cv-interests`) and cleaned up mobile media query to remove `.cv-entry-header`/`.cv-entry-date` rules

## 2026-04-23 — Fifth Round Fixes (Critique R4 + User Corrections)

### Mentorship Intro Rewrite
1. Replaced AI-slop intro in `_pages/students.html` with Option A from critique — direct, states mentoring values (ownership, independence), invites prospective students to reach out, aligns with agents/foundation models/evaluation research framing

### Student Data Corrections (per user)
2. Malgorzata Gwiazda — changed role to "Incoming Ph.D. Student" (`_data/students.yml`)
3. Michal Wilinski — changed role to "Incoming Ph.D. Student" (`_data/students.yml`)
4. Nina Zukowska — updated "now" from "Master's student at FU Berlin" to "Research Intern at Max Planck Institute for Informatics"
5. Arjun Choudhry — updated "now" from "Master's student at CMU" to "Ph.D. student at Georgia Tech"
6. Yifu Cai — updated "now" from "Master's student at CMU" to "Quant Researcher at Millennium"
7. Arnab Dey — updated "now" from "Ph.D. student at Georgia Tech" to "MD candidate at UPenn"

### Committee Corrections (per user)
8. Willa Potosnak — changed degree from "Ph.D." to "Ph.D. Speaking Qualifier"
9. Xinyu (Rachel) Li — changed degree to "Ph.D. Speaking Qualifier", department from "Robotics Institute" to "School of Computer Science"
10. Ambareesh Revanur — changed degree from "Master's" to "MSR Thesis", updated "now" to "Sr. MLE at Adobe"
11. Renamed section from "Thesis Committee Service" to "Committee Service" in `_pages/students.html`

### Broken URL Fixes (from critique)
12. Removed dead Distinguished Dissertation Award link (HTTP 404) from `_pages/index.html` — kept as plain text
13. Cleared dead URL from `_data/awards.yml` for same award
14. Removed dead CMU FLAME Seminar URL from `_data/service.yml` (domain sold to fire safety company)
15. Removed dead Gradient AI URL from `_data/service.yml` (company acquired/rebranded) — kept Streamyard webinar link

### Profile Photo
16. Changed from circular (`border-radius: 50%`) to rounded rectangle (`border-radius: $radius-md`) in `_sass/_homepage.scss` — matches reference sites, preserves background scenery, replaced border with subtle box-shadow

## 2026-04-23 — Sixth Round Fixes (Critique R5 + Theme Renames + Bio Update)

### Must-Fix from Critique
1. Fixed empty `href=""` on Distinguished Dissertation Award — removed `url:` key from `_data/awards.yml` (Liquid treats `""` as truthy)
2. Added `sort: "year" | reverse` to publications page (`_pages/publications.html` line 33) — papers now reverse-chronological within themes
3. Split ICLR 2026 workshop news into separate item (already happened, Apr 2026) and kept ICML 2026 submissions call — fixes temporal inconsistency

### Theme Renames (per user)
4. "Foundation Models for Structured Data" → "Foundation Models" in `_data/publications.yml` and `_pages/publications.html`
5. "Evaluation and Benchmarking" → "Evaluation Science"
6. "Agents and Automation" → "Agents"
7. "Healthcare and Clinical AI" + "AI for Education" merged → "Healthcare & Education"
8. Updated homepage bio anchor from `#healthcare-and-clinical-ai` to `#healthcare--education`

### Nice-to-Have Fixes
9. Fixed `aria-controls` — added `id="news-list"` to `<ul>` in `_includes/news.html`
10. Fixed Distinguished Dissertation Award ordering — swapped YAML order so it appears before RISS award on homepage (both 2025)
11. Darkened `$text-light` from `#94a3b8` to `#6b7280` in `_sass/_variables.scss` for WCAG AA contrast compliance (~4.6:1)
12. Fixed mobile photo ordering — text now appears first at all screen sizes (`order-1` for text, `order-2` for photo)

### Bio Update (per user)
13. Changed "where I lead development of" to "where I helped lead the science behind" for AWS DevOps Agent description

### Profile Layout
14. Restructured to Jon Barron-style: text left (col-8), photo right (col-4), vertically centered, name/title/bio/social all in left column. Photo now 100% width (max 280px), `border-radius: $radius-lg`, no shadow/border
