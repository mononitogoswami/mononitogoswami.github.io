# Website Review -- 2026-04-24

## Summary

The site is clean, well-structured, and communicates a clear research identity. The bio is specific and avoids AI slop. Typography and spacing are tight across most pages. The main issues blocking production are: two award-referenced papers missing from publications.yml, a publications page that claims "40+ publications" but only lists 14, and a forward-dated July 2026 news item sitting at the top of the news feed. Design inconsistencies exist between pages -- the awards and service pages use decorative hover effects, colored borders, and card styling that break from the minimalist pattern established on the homepage and publications page.

## Must-Fix (blocks production)

1. **Publications page claims "40+ publications" but only lists 14.** `_site/publications/index.html:88` says "Selected from 40+ publications at ICML, ICLR, NeurIPS, AAAI, KDD, and other venues." A reader will count 14 papers across 4 themes and notice the discrepancy. Either add the missing papers (workshop papers, extended abstracts, preprints like Chronos-2, TimeSeriesExam, Towards Long-Context, the federated learning paper referenced in mentorship data, etc.) or remove the "40+" claim and just say "Selected publications."

2. **Two papers referenced in awards.yml are missing from publications.yml.** `_data/awards.yml:42-43` references "Towards Long-Context Time Series Foundation Models" (NeurIPS 2024 Workshop Spotlight) and `_data/awards.yml:34` references "TimeSeriesExam: A Time Series Understanding Exam" (ICAIF 2024 Best Paper Honorable Mention). Neither appears anywhere in `_data/publications.yml`. These are award-winning papers that have links on the awards page but no corresponding entry in the publications list. Add them to publications.yml under the appropriate themes.

3. **Forward-dated news item at top of feed.** `_data/news.yml:1-2` -- The top news item is dated July 2026: "Organizing Foundation Models for Structured Data at ICML 2026 (Seoul). Submissions open -- send us your best work!" It is April 2026. Having a future-dated item as the first thing visitors see is unusual and makes the site look pre-populated. Either gate future items (only show news where date <= today), change the date to when the CFP was actually announced, or move it below the April 2026 items.

4. **Homepage bio says "2.5M+ downloads" for MOMENT but news section says "2.2 million" as of Oct 2024.** `_pages/index.html:7` and `_site/index.html:92` say "2.5M+" while `_data/news.yml:35-36` says "crossed 2.2 million downloads" dated Oct 2024. If 2.5M is the current number, the news item is stale but not wrong (it was 2.2M at that time). If the bio number is projected, it is a factual error. Verify against current HuggingFace download stats and ensure both are accurate for their respective dates.

5. **No /cv/ page exists.** `_site/cv/index.html` returns a 404. The homepage social links (`_site/index.html:98`) link to `/cv.pdf` which does exist as a direct download, so this is not a broken link. But if someone navigates to `/cv/`, they get nothing. Either create a redirect from `/cv/` to `/cv.pdf` or accept this as a known gap and document it.

## Should-Fix (important but not blocking)

1. **SpIDER leads the "Agents" section on homepage but Mononito is 3rd author of 6 on a preprint.** `_data/publications.yml:123-135` -- SpIDER is an ArXiv preprint where Mononito is 3rd author. It appears first in the Agents theme on both the homepage selected publications and the full publications page. Leading with a non-first-author preprint weakens the Agents pillar. Consider either reordering (TimeSeriesGym first) or not selecting SpIDER for the homepage.

2. **Key career milestones hidden behind "Show more."** The default 5 visible news items are: ICML 2026 workshop (future), ICLR 2026 workshop, ICLR 2026 paper, Chronos-2, ICML 2025 workshop. The PhD defense with Distinguished Dissertation Award (`_site/index.html:171-173`) and Amazon hire (`_site/index.html:166-168`) are hidden. These are the two most impactful career events. Increase the default visible count from 5 to ~8, or reorder to surface milestones above workshop news.

3. **Chronos-2 not selected for homepage despite being highlighted in news.** `_data/publications.yml:45` has `selected: false` for Chronos-2, yet the Oct 2025 news item prominently mentions 11M downloads. Since Mononito is a middle author on a 23-author paper, not selecting it is defensible. But the news item makes it seem like a major result with no corresponding homepage entry. Either select it or tone down the news item.

4. **Awards page hover effects inconsistent with other pages.** `_sass/_pages.scss:38-42` -- `.award-major-card:hover` has `border-left-color: $primary` and background color change. `_sass/_pages.scss:109-111` -- `.award-paper-card:hover` has background change. No other page uses colored left-border hover effects. For consistency with the minimalist aesthetic, remove the `border-left: 3px solid transparent` pattern from award cards.

5. **Service page workshop cards are visually heavier than any other page element.** `_sass/_pages.scss:322-334` -- `.service-card` has `border: 1px solid $border-color`, `border-radius: $radius-md`, and hover `box-shadow: $shadow-sm`. Combined with teal stat badges (`_sass/_pages.scss:373-381`) and pill-shaped "Accepted Papers" links (`_sass/_pages.scss:383-397`), these cards look like they belong to a different site. Consider a flat list layout matching the reviewing section.

6. **Talk groups use decorative left-border with hover color change.** `_sass/_pages.scss:406-414` -- `.talk-group` has `border-left: 3px solid $border-color` that transitions to `$primary` on hover. This decorative element is absent from all other pages.

7. **Section heading mixin creates inconsistency between homepage and inner pages.** `_sass/_variables.scss:50-66` -- The `section-heading-accent` mixin adds a `::after` pseudo-element with a 2px blue bar. This is used on publications, awards, mentorship, and service pages. But the homepage `.section-heading` (`_sass/_base.scss:67-74`) uses a simpler `border-bottom: 1px solid $border-color` with no blue accent. Unify to one approach.

8. **Student links: Malgorzata Gwiazda uses LinkedIn.** `_data/students.yml:8` links to LinkedIn. Per accumulated feedback, prefer personal websites over LinkedIn. Check if she has a personal site.

9. **Pub-theme-nav pills are the most "designed" element on the site.** `_sass/_publications.scss:52-76` -- Rounded pill links with solid blue active background, `$bg-section` inactive background, and transitions. Sites like jonbarron.info use no sub-navigation at all. Consider plain text links with underline-on-active.

10. **The homepage awards section shows only 3 major awards; the awards page shows 7 total (3 major + 4 paper).** Consider adding one paper award (e.g., ICLR 2023 Spotlight) to the homepage teaser to show publication-level recognition alongside career awards.

11. **NeurIPS venue name is inconsistent.** `_data/publications.yml:77` uses "Neural Information Processing Systems (NeurIPS)" but the standard conference name is "Conference on Neural Information Processing Systems (NeurIPS)." Minor but worth standardizing.

## Nice-to-Have

1. **Google Fonts loads full weight range 300-900.** `_site/index.html:34` loads `wght@0,300..900;1,300..900`. The site only uses weights 500, 600, and 700. Requesting specific weights would reduce font payload.

2. **No `og:image` specific to each page.** All pages use the same `site-logo.png` for Open Graph image. Consider per-page social preview images.

3. **Print styles hide pub-theme-nav but do not reset scroll-margin-top.** `_sass/_base.scss:100-101` hides `.pub-theme-nav` in print, but `_sass/_publications.scss:81` has `scroll-margin-top: 8rem` which wastes vertical space in print. Add `scroll-margin-top: 0` to the print media query.

4. **The fade mask on pub-theme-nav may clip "Healthcare & Education" text.** `_sass/_publications.scss:22-23` uses `mask-image: linear-gradient(to right, black 90%, transparent 100%)`. If the last nav item extends past 90% of the container width, its text will fade. Test on narrower viewports.

5. **Teal accent color ($accent: #0f766e) appears in only two places.** `.mentee-now` (`_sass/_pages.scss:258`) and `.service-card-stat` (`_sass/_pages.scss:373-381`). This introduces a third color used on just two pages. Simplify to `$primary` or `$text-muted` to reduce the color palette.

6. **Footer social links have circle hover backgrounds; homepage social links do not.** `_sass/_footer.scss:30-33` adds `background-color: $primary-light` on hover. `_sass/_homepage.scss:46-53` only changes color. Remove the footer background for consistency.

7. **Award years use blue ($primary) for year labels.** `_sass/_homepage.scss:249` and `_sass/_pages.scss:59` -- colored year labels add visual noise. Use `$text-muted` to match news date styling.

8. **The `pub-badge` class "best-paper" is used for the JoLT "Best Student Abstract" award.** `_site/publications/index.html:348` renders `<span class="pub-badge best-paper">Best Student Abstract</span>`. The semantic class name is misleading. Consider renaming to `.award` or `.best-student-abstract`.

9. **Mentorship intro uses `$text-muted` for primary content.** `_sass/_pages.scss:179` -- the intro paragraph is the first thing a visitor reads but uses gray color (#64748b). The homepage bio uses `$text-color` (#1e293b). Match them.

10. **Mentee topic text is italic.** `_sass/_pages.scss:254` -- the topic line is the most interesting content on each mentee card but italic at 0.87rem reduces its prominence. Consider removing `font-style: italic`.

11. **Homepage selected publications lead with "Agents" theme.** The most impactful work (MOMENT, 2.5M downloads, ICML 2024) is in the second group ("Foundation Models"). Consider reordering to lead with Foundation Models, since that is the strongest signal for first-time visitors.

12. **No structured data for publications.** Consider adding schema.org `ScholarlyArticle` markup for improved search discoverability.

## Page Ratings

| Page | Designer (1-5) | Recruiter (1-5) | Notes |
|------|----------------|-----------------|-------|
| Homepage `/` | 4.0 | 4.5 | Clean layout, strong bio. Minor: theme ordering, future news item, career milestones hidden. |
| Publications `/publications/` | 3.5 | 3.5 | Well-organized by theme. Sticky nav pills over-designed. "40+" claim unsubstantiated. Missing papers from awards. |
| Awards `/awards/` | 3.0 | 4.0 | Good content, strong selectivity context. Hover effects and left-border accents break minimalist pattern. |
| Mentorship `/mentorship/` | 4.0 | 4.5 | Cleanest inner page. Strong outcomes. Two LinkedIn-only links. |
| Service `/service/` | 3.0 | 4.0 | Workshop cards too heavy. Talk grouping effective. Reviewing section is clean. |
| CV `/cv/` | N/A | N/A | Page does not exist. `/cv.pdf` download works via social icon. |

## Designer Critique

### Homepage `/`

The two-column layout (bio left, photo right) with 960px container is standard and well-executed. Source Sans 3 is a clean font choice.

**What works:**
- Profile photo at max-width 280px with rounded corners (`_sass/_homepage.scss:8-13`). Proportionate and professional.
- News section with fixed-width date column (`$news-date-width: 100px`, `_sass/_variables.scss:33`) is scannable. Show/hide toggle keeps the page focused.
- Selected publications grouped by theme with compact entries are dense but readable. Theme labels in small uppercase gray (`_sass/_homepage.scss:144-151`) add structure without visual weight.
- Social icon bar below bio is unobtrusive.
- Mobile: text before photo via `order-1`/`order-2`. News items stack date above text below 575px (`_sass/_homepage.scss:95-104`). No horizontal overflow detected.

**Issues:**
- `_sass/_homepage.scss:249`: Award years use `color: $primary` (blue). News dates use `$text-muted` (gray). These are in adjacent sections but use different color conventions for the same type of data (year/date). Unify.
- `_sass/_homepage.scss:144-151`: Theme sub-headings at 0.78rem uppercase with 0.06em letter-spacing. At this size, the letter-spacing may cause readability issues on low-DPI displays.
- Global line-height 1.7 (`_sass/_variables.scss:25`) vs publication entry line-height 1.4 (`_sass/_homepage.scss:175, 182, 189`) creates a density shift when scrolling from bio to publications.

### Publications `/publications/`

**What works:**
- Publication entries are compact: title (600 weight, 0.93rem), authors (0.85rem), venue (600 weight, 0.85rem), description (muted, 0.85rem), links (0.75rem). Good information density.
- Theme sections with anchor IDs enable deep linking.
- Scroll-spy JavaScript highlights the current theme in the sticky nav.

**Issues:**
- Sticky nav pills (`_sass/_publications.scss:52-76`): Rounded pill links with solid blue active background are the heaviest visual element on the site. Reference academic sites use plain text navigation or no sub-nav.
- Section headings use `section-heading-accent` mixin (`_sass/_publications.scss:85-88`) which adds a blue `::after` underline. Homepage section headings (`_sass/_base.scss:67-74`) use plain `border-bottom`. This is the clearest cross-page inconsistency.
- The `mask-image` gradient (`_sass/_publications.scss:22-23`) that fades the right edge of the nav is a design flourish that may confuse users into thinking content is cut off rather than scrollable.

### Awards `/awards/`

**Issues:**
- Major award cards (`_sass/_pages.scss:34-48`): `border-left: 3px solid transparent` with hover to `$primary` is a decorative element unique to this page. `padding: 1rem 1.25rem` is larger than publication entry padding (0.35rem 0). The awards page feels more "designed" than other pages.
- Paper award cards follow a different card pattern from major awards. Two distinct card styles on one page creates visual inconsistency.
- Year labels use `color: $primary` (`_sass/_pages.scss:59, 130`). On the homepage, award years also use blue (`_sass/_homepage.scss:249`). This is consistent within the awards context but inconsistent with the gray date convention used in news and publications.
- Mobile stacking at 575px (`_sass/_pages.scss:497-511`) correctly breaks flex rows to columns.

### Mentorship `/mentorship/`

**What works:**
- Cleanest inner page. Mentee cards with subtle hover (rgba primary at 0.02) and consistent padding.
- Name-years on a flex row with `justify-content: space-between` is a standard and effective pattern.
- Committee section is appropriately compact.

**Issues:**
- Teal "Now:" line (`_sass/_pages.scss:258`, `color: $accent`) is the only non-blue/gray color on this page. Using `$text-muted` or a muted version of `$primary` would be more consistent.
- Mentorship intro uses `$text-muted` (`_sass/_pages.scss:179`) while the homepage bio uses `$text-color`. The intro is primary content and should not be grayed out.

### Service `/service/`

**Issues:**
- Workshop cards (`_sass/_pages.scss:322-334`): `border: 1px solid $border-color`, `border-radius: $radius-md`, hover `box-shadow: $shadow-sm`, plus teal stat badges and blue pill links. This is the heaviest visual treatment on the site. The reviewing section at the bottom of the same page uses a simple flat list -- the contrast is jarring.
- Talk group left borders (`_sass/_pages.scss:406-414`) with hover color transitions add unnecessary interactivity.
- The bullet dots on talk venue items (`_sass/_pages.scss:438-448`, `&::before` with 4px circles) add visual clutter. A simple dash or no marker would be cleaner.

## Recruiter/Student Critique

### 10-Second Impact Test

The homepage passes. Within 10 seconds a visitor learns: Applied Scientist at Amazon, built AWS DevOps Agent, PhD from CMU Robotics, created MOMENT (2.5M+ downloads), works on foundation models + evaluation + agents, Distinguished Dissertation Award. Role, product, research impact, credentials, and award -- all in 3 short paragraphs.

### Bio Quality (No-Slop Check)

The bio is direct and specific. No filler phrases detected. It leads with a concrete claim ("I build AI agents...") and immediately grounds it with a specific product (AWS DevOps Agent). Each subsequent sentence adds a new fact.

One flag: "Foundation models provide the reasoning backbone; rigorous evaluation provides the trust layer -- what I think of as the *science of agents*" (`_pages/index.html:9`). The first clause is a good concise framing. "What I think of as the *science of agents*" is a self-coined term that adds no information for a reader who does not already know the author. A hiring manager will not know what it means. The preceding sentence already makes the point. Cutting it would strengthen the paragraph.

### Selected Publications

Seven selected papers across three themes:
- **Agents:** SpIDER (ArXiv preprint, 3rd author), TimeSeriesGym (ArXiv preprint, 3rd author)
- **Foundation Models:** Exploring Representations (ICML 2025, 2nd author), MOMENT (ICML 2024, 1st author)
- **Evaluation Science:** TimeSeriesExamAgent (ICLR 2026, 3rd author), AQuA (NeurIPS 2023, 1st author), Unsupervised Model Selection (ICLR 2023 Spotlight, 1st author)

The Agents theme is the weakest: two preprints, neither first-author. A hiring manager will notice. The Foundation Models theme anchors on MOMENT which is clearly the flagship work. Evaluation Science is the strongest section with three top-venue papers spanning 2023-2026.

The theme ordering (Agents first) means the first two papers a visitor sees are preprints where Mononito is not first author. Reordering to Foundation Models > Evaluation Science > Agents would lead with the strongest work.

### News Section Momentum

The news section tells a clear upward trajectory: PhD start (2020), ICLR Spotlight (2023), MOMENT at ICML (2024), Google Research internship (2024), PhD defense with Distinguished Dissertation Award (2025), AWS hire (2025), continued ICLR 2026 publishing, and growing workshop organizing. The momentum is real and well-documented.

Problem: The default 5 visible items are all workshops and papers. The career-defining events (PhD defense, dissertation award, industry hire) require clicking "Show more." A recruiter who does not click will miss them.

### Prospective Student View

The mentorship page is the strongest signal for students considering working with Mononito:
- 10 mentees across 5 years (2021-2025), spanning PhD students, RISS scholars, undergrads
- Concrete outcomes: Georgia Tech PhD, Cornell PhD, CMU PhD, ETH Zurich RA, Millennium quant, UPenn MD candidate
- Specific research topics for each mentee
- RISS mentoring award validates the claim
- Intro paragraph sets expectations: "real ownership of research questions"

**Missing:** No explicit statement about whether Mononito is currently taking students/interns at Amazon. The mentorship page says "reach out" but does not clarify capacity, constraints, or what kind of collaboration is possible from an industry role.

### What a Hiring Manager Would Look For

For an industry research role (lateral/promotion):
- Publication impact: clear (MOMENT with 2.5M downloads, ICLR Spotlight)
- Industry experience: Amazon, Google Research, AWS AI Labs -- all mentioned
- Leadership: AWS DevOps Agent, 4 workshops in 2 years, 10-person mentorship track record
- **Missing:** No citation count. Google Scholar is linked. Adding "N citations" to the bio would strengthen it if numbers support the claim.
- **Missing:** No patents mentioned. If Amazon work produced patents, consider listing them.

For academic faculty search:
- Distinguished Dissertation Award is a very strong signal
- 4 workshops in 2 years shows community building
- 10-person mentorship track record is strong for a fresh PhD
- **Missing:** No teaching experience listed anywhere
- **Missing:** No explicit research directions or forward-looking statement

### Completeness Gaps

1. The "40+ publications" claim needs to be backed by the actual list or removed.
2. Two award-winning papers exist only on the awards page, not on the publications page.
3. No teaching record appears anywhere on the site.
4. No patents listed.
5. Chronos-2 (11M downloads) is highlighted in news but not on the homepage.
