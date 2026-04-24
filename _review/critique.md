# Website Review -- 2026-04-24

## Summary

The site is well-structured and conveys a clear research identity. The content is factual, specific, and mostly avoids AI slop. The main production blockers are: (1) stale "Incoming Ph.D. Student" labels that are 8 months out of date, (2) a canonical URL mismatch between `_config.yml` and the built HTML, (3) a stale build producing a garbled venue name on the service page and inaccurate renderings in the news section, and (4) the awards page being unreachable from the navbar. The design is clean and professional, though some styling choices (colored badge pills, decorative border-left hover effects, teal stat badges, workshop cards with borders and shadows) drift from the Barron-style minimal aesthetic the site targets.

## Must-Fix (blocks production)

1. **Stale build: rendered HTML does not match source data.** Multiple discrepancies between `_data/*.yml` source files and `_site/*.html` output indicate the built site is stale. Specific examples:
   - `_site/service/index.html:278` renders "US Naval Center Warfare Center, Carderock Division" but `_data/service.yml:87` says "Naval Surface Warfare Center, Carderock Division." The official name is Naval Surface Warfare Center, Carderock Division (NSWCCD).
   - `_site/index.html:169` renders the dissertation award news as "(1 of 35 recipients)" but `_data/news.yml:26` says "selected from ~35 graduating PhD students." The rendered phrasing implies 35 winners; the source phrasing is correct.
   - `_site/index.html:217` describes AQuA as "our data-centric benchmark for time series anomaly detection" but `_data/news.yml:50` correctly says "our benchmark for label quality assessment." AQuA is about label quality, not anomaly detection.
   - `_site/index.html:15` canonical URL is `https://mononitogoswami.github.io/` but `_config.yml:4` says `url: "https://mononito.com"` and `CNAME` contains `mononito.com`.
   **Fix:** Rebuild the site with `bundle exec jekyll build` and verify output matches source data before deploying.

2. **Stale "Incoming" labels on mentorship page.** `_data/students.yml:5` and `_data/students.yml:12` list Malgorzata Gwiazda and Michal Wilinski as "Incoming Ph.D. Student, Robotics Institute." It is April 2026 -- CMU's fall semester started August 2025. These students have been enrolled for 8 months. Update to "Ph.D. Student, Robotics Institute" or verify their actual current status.

3. **Canonical URL mismatch.** `_config.yml:4` says `url: "https://mononito.com"` and `CNAME` contains `mononito.com`, but the built site's canonical URL, og:url, og:image, twitter:image, and JSON-LD structured data all use `https://mononitogoswami.github.io/`. This likely means GitHub Pages overrode the URL during build. When deploying to the custom domain `mononito.com`, all canonical URLs must point to `mononito.com`. Build locally with the correct URL and verify, or ensure the GitHub Pages build environment respects the `_config.yml` URL. This directly affects SEO indexing and social media card previews.

4. **Awards page is an orphan -- not in navbar.** `_data/navigation.yml` lists Research, Mentorship, Service but not Awards. The awards page at `/awards/` is reachable only via the "View all awards & honors" link on the homepage (`_site/index.html:501`). A visitor landing on `/awards/` from a search engine has no navbar indication of where they are. Either add Awards to the navigation or add a visible breadcrumb/back link on the awards page.

5. **"Evaluation & Benchmarks" vs. "Evaluation Science" label mismatch between homepage and publications page.** The homepage selected publications section (visible in `_site/index.html:387`) uses the heading "Evaluation Science" (from `selected_theme` in `_data/publications.yml`), and the publications page (`_site/publications/index.html:254`) also uses "Evaluation Science" (from `theme`). However, per the Round 6 review notes in the previous critique, this was flagged as a mismatch in earlier rounds. Verify that both pages now show the same label in the current build. If the labels differ, pick one name and use it consistently across `selected_theme` and `theme` fields in `_data/publications.yml`.

## Should-Fix (important but not blocking)

1. **Homepage bio contains branding jargon.** `_pages/index.html:9` -- the phrase "what I think of as the *science of agents*" is a self-coined term that adds no information. A hiring manager will not know what it means. The preceding sentence ("Foundation models provide the reasoning backbone; rigorous evaluation provides the trust layer") already makes the point. Cut "what I think of as the *science of agents*."

2. **First news item is 3 months in the future.** `_data/news.yml:1-2` -- the top news item is dated July 2026: "Organizing Foundation Models for Structured Data at ICML 2026 (Seoul). Submissions open -- send us your best work!" Having a future-dated item as the first thing visitors see is unusual and makes the site look either pre-populated or auto-generated. Consider gating future items (only show news where `date <= today`) or moving this below the already-happened items.

3. **Important career milestones are hidden behind "Show more."** The first 5 visible news items are: ICML 2026 workshop (future), ICLR 2026 workshop, ICLR 2026 paper, Chronos-2, ICML 2025 workshop. The PhD defense with Distinguished Dissertation Award (`_site/index.html:169`) and AWS hire (`_site/index.html:163`) are hidden. These are the two most impactful career events for a recruiter or prospective student. Consider increasing the default visible count from 5 to 8, or reordering to surface milestones.

4. **SpIDER leads the "Agents" section on homepage and publications page, but Mononito is 3rd author.** `_data/publications.yml:124` -- SpIDER is a preprint where Mononito is 3rd of 6 authors. Leading with it in the selected publications on the homepage dilutes the signal compared to first-author or more established work. TimeSeriesGym (3rd author but with a released codebase and benchmark) or omitting SpIDER from selected pubs would be stronger.

5. **Chronos-2 absent from homepage selected publications despite 11M downloads.** `_data/publications.yml:46` has `selected: false`. The news section prominently mentions 11M downloads (`_data/news.yml:11`). Including Chronos-2 as a selected paper under Foundation Models would strengthen the homepage, even with a middle-author position, because the scale of impact is exceptional.

6. **Publications page claims "Selected from 40+ publications."** `_site/publications/index.html:84` -- the page actually lists 14 papers. The 40+ claim should be verifiable against Google Scholar. If accurate, the gap is large. If not accurate, it is a factual error.

7. **No /cv/ page -- navigating to /cv/ returns 404.** The CV link in the social bar points to `/cv.pdf` (direct download, file exists). But if someone types or follows a link to `/cv/`, they get a 404. Either create a redirect page or accept this as a known gap.

8. **NeurIPS venue_full is inconsistent.** `_data/service.yml:9` says `venue_full: "Neural Information Processing Systems"` but the standard name is "Conference on Neural Information Processing Systems." The publications data (`_data/publications.yml:77`) uses "Neural Information Processing Systems (NeurIPS), 2023" which also drops "Conference on." Minor inconsistency but worth standardizing.

## Nice-to-Have

1. **Design: `section-heading-accent` mixin adds decorative blue underline.** `_sass/_variables.scss:50-66` -- the `::after` pseudo-element draws a blue 2px accent line under each h2. Sites like jonbarron.info and leonidk.com use no colored decorations on headings. Removing the `::after` accent and keeping only `border-bottom` would better match the minimal target.

2. **Design: service cards have borders, rounded corners, and hover shadows.** `_sass/_pages.scss:322-334` -- workshop organization cards use `border: 1px solid`, `border-radius: $radius-md`, and hover `box-shadow: $shadow-sm`. This is more Material Design than Barron-minimal. A simpler approach: list workshops like the reviewing section, using only typography and whitespace.

3. **Design: award years and award-major-year use blue (`$primary`).** `_sass/_homepage.scss:249` and `_sass/_pages.scss:59` -- colored year labels add visual noise. Barron-style sites use a single text color with bold/regular weight for hierarchy. Consider using `$text-muted` or `$text-color` for years.

4. **Design: pub-theme-nav pills with colored active state.** `_sass/_publications.scss:52-76` -- the sticky theme nav uses pill-shaped links with blue active background. Simpler alternative: text links with bold or underline for active state.

5. **Design: teal stat badges on service cards.** `_sass/_pages.scss:373-381` -- `service-card-stat` uses `$accent` teal on `$accent-light` background. This introduces a second brand color used only here and in `mentee-now` (`_sass/_pages.scss:258`). A single-accent palette would be cleaner.

6. **Design: talk group border-left hover transitions to `$primary`.** `_sass/_pages.scss:410-414` -- the left border jumps from light gray to blue on hover. This decorative hover effect is unnecessary for a static reference page.

7. **Design: footer social links have circle hover backgrounds; homepage social links do not.** `_sass/_footer.scss:30-33` adds `background-color: $primary-light` on hover, while `_sass/_homepage.scss:46-53` only changes color. Removing the footer background would make both consistent.

8. **Design: homepage pub-description color.** `_sass/_homepage.scss:155` uses `color: $text-muted` (confirmed from the stylesheet). The equivalent on the publications page (`_sass/_publications.scss:125`) also uses `$text-muted`. Verify these match -- earlier review rounds flagged a discrepancy where the homepage used `$text-color`.

9. **Google Fonts loads full weight range 300-900.** `_site/index.html:34` loads `wght@0,300..900;1,300..900`. The site only uses weights 500, 600, and 700. Requesting `wght@500;600;700` would reduce font payload.

10. **Consider showing 8 news items by default instead of 5.** The PhD defense, AWS hire, and TimeSeriesGym release are all hidden behind "Show more." Increasing the visible count would surface the most impactful career events.

11. **Mentorship intro uses `$text-muted` for primary content.** `_sass/_pages.scss:179` -- the mentorship intro paragraph is the first thing a visitor reads on the page, but its gray color (`#64748b`) makes it feel like a subtitle. The homepage bio uses `$text-color` (`#1e293b`). For consistency and readability, the mentorship intro should match.

12. **Mentee topic text is italic at 0.87rem.** `_sass/_pages.scss:254` -- the topic line ("what did this person work on?") is the most interesting content on each mentee card. Italic at 0.87rem reduces its prominence. Consider removing `font-style: italic` or increasing to 0.9rem.

## Page Ratings

| Page | Designer | Recruiter | Notes |
|------|----------|-----------|-------|
| Homepage (/) | 8/10 | 8/10 | Clean layout, strong bio, good news section. Minor: blue accents, "science of agents" phrase, career milestones hidden by default, future-dated news on top. |
| Publications (/publications/) | 8/10 | 7/10 | Well-organized by theme. Sticky nav is useful. SpIDER leads Agents section as 3rd-author preprint. "40+" claim needs verification. |
| Awards (/awards/) | 7/10 | 7/10 | Good content. Card hover effects and blue accents drift from minimal aesthetic. Not in navbar -- orphan page. |
| Mentorship (/mentorship/) | 7/10 | 8/10 | Strong mentorship record. Stale "Incoming" labels are the main issue. Good outcomes listed for past mentees. |
| Service (/service/) | 7/10 | 7/10 | Workshop cards are visually heavier than needed. Talk grouping by topic is effective. Stale build shows wrong venue name. |
| CV (/cv/) | N/A | 5/10 | Page does not exist. PDF download works via social icon but requires knowing to click the icon. |

## Designer Critique

### Homepage (/)

The two-column layout (bio left, photo right) with 960px container is standard and well-executed. Source Sans 3 is a clean choice for an academic site.

**What works:**
- Profile photo at max-width 280px with rounded corners is proportionate.
- News section with date/text columns is scannable. The show/hide toggle keeps the page focused.
- Selected publications grouped by theme with compact entries are dense but readable.
- Social icon bar below the bio is unobtrusive.
- Mobile: text appears before photo via `order-1`/`order-2` classes. News items stack date above text below 575px. No horizontal overflow.

**Issues:**
- `_sass/_variables.scss:57-65`: The `section-heading-accent` mixin's `::after` blue bar is a decorative element that the reference sites (jonbarron.info, leonidk.com) avoid.
- `_sass/_homepage.scss:144-151`: Theme sub-headings at 0.78rem uppercase with letter-spacing are small. On some screens this may be hard to read.
- `_sass/_homepage.scss:249`: Blue year in award items is unnecessary color.
- Line-height at 1.7 globally (`_sass/_variables.scss:25`) is generous for body text but makes the publications section feel loose. The publication entries use tighter 1.4 line-height which creates an inconsistency.

### Publications (/publications/)

- Sticky theme nav with pill links, scroll-spy, and horizontal scroll fade is technically well-done. Visually, the pills are heavier than needed -- compare to jonbarron.info which uses no sub-navigation at all.
- Publication entries are compact: title (600 weight), authors, venue (600 weight), description (muted), links. The information density is appropriate.
- Badge styling uses three colors (amber, green, blue) for Spotlight, Best Paper, and Oral. Reference sites use plain text labels or no badges at all.
- The page lists 14 papers grouped into 4 themes. Each theme has 2-7 papers. The Healthcare & Education section (7 papers) is the longest and includes work from 2020-2024.

### Awards (/awards/)

- Major award cards with left-border hover (`_sass/_pages.scss:36-42`) and paper award cards with background hover (`_sass/_pages.scss:110-112`) add interactivity that a static reference page does not need.
- The description text indented to 4.25rem (`_sass/_pages.scss:95`) aligns with the content after the year column. Good alignment.
- The page uses two distinct card styles (major vs. paper awards). This creates visual variety but also inconsistency.

### Mentorship (/mentorship/)

- Card layout for mentees with name-years on a flex row is clean. Hover background is subtle (rgba primary at 0.02).
- The teal "Now:" line (`_sass/_pages.scss:258`) is the only teal on this page. Using a neutral color would be more consistent.
- Mobile stacking at 575px for mentee headers works correctly.

### Service (/service/)

- Workshop cards are the heaviest visual elements on the entire site: `border: 1px solid`, `border-radius`, hover `box-shadow`, teal stat badge, blue pill link. This page looks like it belongs to a different site than the homepage.
- Talk grouping by topic with left border is an effective organizational device but the hover color change is unnecessary.
- Reviewing list is the cleanest section -- simple text with no decoration. This should be the model for the other sections.

## Recruiter/Student Critique

### 10-Second Impact Test

The homepage passes. First paragraph: Applied Scientist at Amazon, AWS DevOps Agent. Second paragraph: MOMENT (ICML 2024, 2.5M+ downloads), three specific evaluation papers cited by name. Third paragraph: PhD in Robotics at CMU, Artur Dubrawski (linked), Distinguished Dissertation Award, Google Research, AWS AI Labs. Role, product, research impact, credentials, and advisor -- all within 3 paragraphs.

### Bio Quality

Direct and specific. Two flags:
- "what I think of as the *science of agents*" -- this is the only phrase that reads like personal branding rather than description. A hiring manager scanning quickly will skip it because it is not a recognizable term of art. Cut it.
- The second paragraph packs a lot of information. It names 5 specific papers/systems in one sentence. This is good for someone who wants to evaluate the work, but a skimmer might bounce off the density. The linking to specific papers helps.

### Publication Selection

Seven selected papers across three themes:
- **Agents:** SpIDER (preprint, 3rd author), TimeSeriesGym (preprint, 3rd author)
- **Foundation Models:** Representations paper (ICML 2025, 2nd author), MOMENT (ICML 2024, 1st author)
- **Evaluation Science:** TimeSeriesExamAgent (ICLR 2026, 3rd author), AQuA (NeurIPS 2023, 1st author), Model Selection (ICLR 2023 Spotlight, 1st author)

The Agents section is the weakest: two preprints, neither first-author. A hiring manager will notice. The Evaluation Science section is the strongest: three top-venue papers spanning 2023-2026 with first-author representation. MOMENT is the flagship paper with clear impact metrics.

Missing from selected: Chronos-2 (11M downloads, Amazon collaboration) would strengthen Foundation Models and signal industry-scale impact. JoLT (Best Student Abstract at AAAI) could add breadth. Counterfactual Phenotyping at KDD is a strong venue paper that is currently not selected.

### News Momentum

The news section tells an upward trajectory from PhD start (Aug 2020) through ICLR Spotlight, MOMENT at ICML, Google Research internship, PhD defense with Distinguished Dissertation, AWS hire, continued publishing at ICLR 2026, and workshop organizing. But the default 5 visible items focus on workshops and papers (Jul 2026 to Oct 2025). The career-defining events -- PhD defense, dissertation award, industry hire -- require clicking "Show more."

### Prospective Student View

The mentorship page is the strongest signal for prospective students:
- 8 past mentees with concrete outcomes: 3 went to PhD programs (Georgia Tech, Cornell, CMU), 1 to ETH Zurich, 1 to Millennium, 1 to UPenn MD. These are strong placements.
- Research topics are specific (not generic "machine learning").
- The mentoring award from RISS adds credibility.
- The intro paragraph ("I care about giving mentees real ownership of research questions and helping them build the judgment to tackle open problems independently") is direct and sets expectations.

The stale "Incoming" labels undermine this otherwise strong page. A visiting student will notice the site has not been updated.

### What's Missing (Noting, Not Prescribing)

- No citation count or h-index anywhere on the site.
- No teaching record.
- No blog or technical writing.
- No patent information.
- No explicit "I am hiring / looking for students" statement (the mentorship intro implies openness but does not state it directly).

These are all reasonable omissions for someone in an industry research role. The mentorship page's "reach out" link partially addresses the last point.
