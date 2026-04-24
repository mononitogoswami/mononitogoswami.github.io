# Research Vision Analysis

## Current Framing Assessment

### "Science of Agents" and "Agents for Agentic Science"

This framing has real intellectual appeal -- it sets up a virtuous cycle where (1) you study how to build and evaluate agents rigorously ("Science of Agents") and (2) you use agents to accelerate the scientific process itself ("Agents for Agentic Science"). The symmetry is elegant and the ambition is genuine. But there are several tensions to work through before committing to it.

**Strengths of this framing:**

- It is forward-looking and captures where the field is heading. Agents are the dominant paradigm shift in AI right now, and positioning at their intersection with rigorous evaluation is timely.
- It naturally accommodates both your academic work (benchmarks, foundation models, evaluation methodology) and your industry work (AWS DevOps Agent, incident response).
- The "Science of" framing signals intellectual seriousness -- you are not just building agents, you are studying what makes them work and how to know when they fail. This is a scarce and valuable position.
- The dual structure creates a research program, not just a collection of papers. It implies a long-term agenda with internal coherence.

**Tensions and risks:**

1. **Coverage gap with existing work.** A significant fraction of your publications -- MOMENT, Chronos-2, MICA, long-context TSFMs, representation analysis, the healthcare/clinical AI papers, weak supervision, federated learning -- do not obviously fall under either "Science of Agents" or "Agents for Agentic Science." MOMENT is a foundation model, not an agent. The clinical AI work is applied ML. Forcing these under an agents umbrella would feel revisionist. Your publication record tells a story of structured data foundation models and rigorous evaluation with an increasingly agentic trajectory -- not a story that was always about agents.

2. **"Agentic Science" is aspirational, not yet demonstrated.** You do not yet have a published paper where an agent does science (e.g., an agent that autonomously forms hypotheses, designs experiments, analyzes results in a scientific domain). TimeSeriesGym is closer -- agents doing ML engineering -- but that is engineering, not science per se. TimeSeriesExamAgent generates benchmarks, which is evaluation infrastructure. The phrase "Agentic Science" risks overpromising relative to the current portfolio.

3. **"Science of Agents" is quite broad.** Many people study agents. What is distinctive about your version? The distinctive thing is your focus on evaluation methodology and structured/temporal data -- but that specificity gets lost in the umbrella phrase.

4. **The name competes with established framings.** "Science of Agents" echoes multi-agent systems literature going back decades. "Agentic Science" evokes the AI-for-science movement (which typically means molecular simulation, protein folding, materials design). Neither phrase immediately communicates what you actually do.

### Verdict

The intellectual direction is right. The specific phrasing needs refinement. The two-pillar structure (Scalable Evaluation & Datasets + Scalable Reasoning Engines) is more honest about the current portfolio than the umbrella phrase, but the pillars themselves also need adjustment (see Refined Conceptualization below).

---

## Reference Points

Note: WebFetch was unavailable during this analysis. The following draws on knowledge of these researchers' public framing as of early 2025, supplemented by understanding of the broader landscape.

### Sherry Yang (Berkeley / Google DeepMind)

Yang frames her work around **"Foundation Models as a Basis for Agents"** -- the idea that large pretrained models (language, vision, multimodal) can serve as the core reasoning engine for agents that act in the world. Her key conceptual contribution is showing that the same model can be a policy, a world model, and a reward function depending on how it is prompted or fine-tuned. Her pillars:
- Foundation models as decision-making engines
- Grounding language models in interactive environments
- Evaluation of agent capabilities

**Relevance to Mononito:** Yang's work is primarily in the embodied/interactive setting (robotics, games, web navigation). Mononito's is in structured data and DevOps/software. But the intellectual move is similar: take foundation models and study how they reason, act, and can be evaluated. The key difference is that Mononito has a deeper evaluation/benchmarking thread (AQuA, TimeSeriesExam, TimeSeriesGym, ARFBench) that Yang does not emphasize as strongly.

### Ofir Press (Princeton)

Press frames his work around **improving the fundamental capabilities of language models** -- their ability to process long contexts, reason step-by-step, and generalize. His research themes:
- Length generalization and positional encodings (ALiBi)
- Compositional reasoning in LLMs
- Efficient inference and generation

**Relevance to Mononito:** Press's framing is narrower and more mechanistic -- he picks a specific capability (length generalization, reasoning) and studies it deeply. Mononito's work on time series foundation models has a similar flavor (understanding what these models learn, how they compose, how to evaluate their reasoning), but spans a wider scope. Press's lesson: a narrow, crisp framing can be very effective for early career. You do not need to claim everything.

### Aman Sinha (Stanford)

Sinha works at the intersection of **reinforcement learning, robustness, and agents** with a focus on decision-making under uncertainty. His framing emphasizes:
- Robust optimization for sequential decision-making
- Offline RL and learning from historical data
- Safety and reliability of autonomous systems

**Relevance to Mononito:** The "learning from trajectories" aspect of the AWS DevOps Agent (continual learning from real-world incident trajectories) is conceptually adjacent to Sinha's offline RL work. But Sinha's framing is theoretically grounded (distributionally robust optimization), while Mononito's is empirically grounded (large-scale benchmarks, foundation models). Different lanes, but both care about reliability.

### Other relevant framings from recent faculty hires (2023-2025):

- **Tianhe (Kevin) Yu (USC, from Google Brain):** "How can robots learn general-purpose skills?" -- single question, broad program. Simple and effective.
- **Yifei Zhou (UT Austin):** Frames around "efficient and reliable language agents" -- combining efficiency (inference cost) with reliability (evaluation, verification).
- **Xiang Lisa Li (Stanford/CMU):** "Controllable and trustworthy generation" -- focuses on steering model behavior and knowing when outputs are reliable.
- **Danqi Chen (Princeton):** When starting, framed as "building NLP systems that can read, understand, and reason" -- verb-based framing that communicated capability without jargon.

### Patterns across successful early-career framings:

1. **Lead with a question or tension, not a method.** "How do we know when AI systems work?" is more compelling than "I build benchmarks."
2. **Two to three pillars maximum.** More than three feels scattered. Two creates a productive tension or complementarity.
3. **Each pillar should have at least 3-4 papers.** A pillar with one paper is a project, not a research direction.
4. **The pillars should interact.** The best framings show how work in one area enables or motivates work in another (Yang: foundation models enable agents, agents stress-test foundation models).
5. **The forward-looking vision should be concrete enough to imagine specific papers.** "I want to build reliable AI agents" is too vague. "I want to create agents that can autonomously diagnose and resolve production software incidents, and develop the evaluation methodology to know when they are trustworthy enough to deploy" is a research program.
6. **Acknowledge domain grounding.** The best framings are not purely methodological -- they name the domains where the work matters (healthcare, software engineering, scientific discovery).

---

## Refined Conceptualization

### The Core Narrative

Your research has a genuine throughline that is more specific and honest than "Science of Agents." Here is what I see when I read the full publication list chronologically:

**Phase 1 (2019-2022): Structured data + weak supervision in high-stakes domains.** You figured out how to build reliable models when labels are expensive or unavailable, primarily in healthcare. This was not about agents, but it was deeply about a problem that persists: how do you train and evaluate AI systems when ground truth is scarce?

**Phase 2 (2023-2024): Foundation models for structured data + evaluation methodology.** MOMENT showed that the foundation model paradigm works for time series. Simultaneously, AQuA, model selection (ICLR 2023), JoLT, and TimeSeriesExam built the evaluation infrastructure. The thesis: scaling up data and models is necessary but not sufficient -- you also need new ways to measure whether the scaled-up systems actually work.

**Phase 3 (2025-2026): Agents that reason over structured data + scalable evaluation of agents.** TimeSeriesGym, TimeSeriesExamAgent, ARFBench, SpIDER, and the AWS DevOps Agent extend the same two concerns (building capable systems + evaluating them rigorously) into the agentic setting.

The honest framing is not "Science of Agents" (which sounds like you have always studied agents) but rather something like:

> **"Building and evaluating AI systems that reason over real-world structured data -- from foundation models to agents."**

Or more concisely:

> **"Reliable AI for structured reasoning: foundation models, agents, and the evaluation science to trust them."**

### Proposed Pillar Structure

I recommend **three pillars**, not two. The two-pillar structure (Scalable Evaluation & Datasets vs. Scalable Reasoning Engines) conflates "foundation models" with "agents" under "Reasoning Engines," which obscures the intellectual progression. Three pillars better capture the portfolio:

---

#### Pillar 1: Foundation Models for Structured Data
*Building the base reasoning capabilities*

The core question: Can we pretrain general-purpose models on structured (especially temporal) data that transfer across tasks, domains, and scales -- the way LLMs transfer across language tasks?

| Paper | Venue | Role |
|-------|-------|------|
| MOMENT | ICML 2024 | First-author, core contribution |
| Exploring Representations and Interventions in TSFMs | ICML 2025 | Senior/mentoring role |
| Chronos-2 | Preprint 2025 | Contributor (Amazon/Google collaboration) |
| MICA | Preprint 2026 | Senior/mentoring role |
| Towards Long-Context TSFMs | NeurIPS Workshop 2024 | Senior/mentoring role |
| JoLT | AAAI 2024 (Best Student Abstract) | Senior/mentoring role |
| STAMP | ML4H 2025 | Senior/mentoring role |

**What connects them:** Scaling laws for structured data; interpretable representations that emerge from self-supervised pretraining; multimodal reasoning (time series + text); architectural innovations for long-context temporal data.

**Forward-looking questions:** What are the scaling laws for structured data foundation models? How do we achieve multimodal reasoning across time series, metrics, logs, and natural language? Can foundation models learn causal structure from observational temporal data?

---

#### Pillar 2: Evaluation Science for AI Systems
*Knowing when AI systems work -- and when they don't*

The core question: How do we rigorously evaluate AI systems (models and agents) when ground truth is scarce, tasks are open-ended, and the cost of failure is high?

| Paper | Venue | Role |
|-------|-------|------|
| TimeSeriesGym | Preprint 2025 | Senior author |
| TimeSeriesExamAgent | ICLR 2026 | Senior author |
| TimeSeriesExam | NeurIPS Workshop / ICAIF 2024 (Best Paper HM) | Senior author |
| ARFBench | ICLR Workshop 2026 | Senior author (Amazon) |
| AQuA | NeurIPS 2023 | First author |
| Unsupervised Model Selection for TS Anomaly Detection | ICLR 2023 (Spotlight) | First author |
| Investigating Compositional Reasoning in TSFMs | Preprint 2025 | Senior/mentoring role |
| Implicit Reasoning in Deep TS Forecasting | NeurIPS Workshop 2024 | Senior/mentoring role |
| Impermanent (Live Benchmark) | Preprint 2026 | Contributor |
| LLM Agents Struggle at TS ML Engineering | ICML Workshop 2025 | Senior author |

**What connects them:** A progression from evaluating models (unsupervised model selection, label quality) to evaluating foundation models (compositional reasoning, implicit reasoning, TimeSeriesExam) to evaluating agents (TimeSeriesGym, ARFBench). Each step requires new methodology because the systems are more capable and the failure modes are more subtle.

**Forward-looking questions:** How do we build evaluation frameworks that keep pace with rapidly improving agents? Can evaluation itself be automated without losing rigor (the TimeSeriesExamAgent direction)? How do we evaluate agents in production systems where offline benchmarks are insufficient (the ARFBench direction)?

---

#### Pillar 3: Agents for Complex Reasoning and Decision-Making
*From models that predict to systems that act*

The core question: How do we build AI agents that can reason over complex, multimodal, structured data to solve real-world problems -- and learn continuously from their experience?

| Paper / System | Venue | Role |
|-------|-------|------|
| AWS DevOps Agent | Generally Available product | Lead scientist |
| TimeSeriesGym (agent side) | Preprint 2025 | Senior author |
| ARFBench (agent side) | ICLR Workshop 2026 | Senior author |
| SpIDER | Preprint 2025 | Senior author (Amazon) |
| TimeSeriesExamAgent (agent side) | ICLR 2026 | Senior author |

**What connects them:** Agents that operate over structured, multimodal data (metrics, logs, traces, time series) in high-stakes settings (production software, healthcare). The emphasis is on reliability (continual learning, steerable behavior) and grounding (agents that reason over real telemetry, not just text).

**Forward-looking questions:** How do agents learn from their own trajectories to improve over time (continual learning)? How do we steer agent behavior to align with domain-specific constraints? Can multi-agent architectures scale to enterprise-grade incident response?

---

### How the Three Pillars Interact

This is where the narrative becomes more than the sum of its parts:

```
Pillar 1 (Foundation Models)  ──enables──>  Pillar 3 (Agents)
     builds reasoning capabilities            that act on structured data

Pillar 3 (Agents)  ──demands──>  Pillar 2 (Evaluation Science)
     complex autonomous behavior               requires new evaluation paradigms

Pillar 2 (Evaluation Science)  ──improves──>  Pillar 1 (Foundation Models)
     rigorous benchmarks                        reveal failure modes, guide pretraining
```

The cycle: better foundation models enable more capable agents; more capable agents demand more rigorous evaluation; more rigorous evaluation reveals gaps that motivate better foundation models.

### Where Does the Rest of the Publication Record Fit?

**Healthcare and Clinical AI (7 papers):** These are the *domains* where the methods from Pillars 1-3 were developed and validated. The sepsis subphenotyping, survival prediction, and clinical time series work is where the weak supervision and evaluation methodology were stress-tested. Frame these as "application domains that motivated the methodology" rather than a separate pillar. In a faculty application, healthcare is a selling point for funding (NIH, DoD) and interdisciplinary collaboration.

**Weak Supervision and Federated Learning (6 papers):** This is the intellectual origin story. Weak supervision is how you build models when labels are scarce -- which is the same problem that motivates Pillar 2 (evaluation when ground truth is scarce). Federated learning is how you train across data silos -- relevant to the distributed nature of production systems in Pillar 3. These are *enabling techniques* that recur across the pillars, not a separate pillar.

**AI for Education and Social Computing (9 papers):** This is pre-PhD and early-PhD work. It demonstrates range and a longstanding interest in AI systems that interact with humans. For the research vision, these are best treated as "earlier work" that shows intellectual curiosity but are not part of the forward-looking narrative.

### Naming the Overall Program

Some options, ranked by my assessment of fit:

1. **"Reliable Intelligence for Structured Reasoning"** -- Emphasizes the structured data specificity and the reliability/evaluation thread. Slightly abstract.

2. **"Building and Evaluating AI Systems That Reason Over the Real World"** -- More accessible but less specific. "Real world" does a lot of work.

3. **"From Foundation Models to Trustworthy Agents"** -- Captures the trajectory. The word "trustworthy" is overused in the field but is genuinely central to your work.

4. **"The Science of Reliable AI Agents"** -- Keeps the "Science of" framing but adds "Reliable" to differentiate. Still risks the agents-only interpretation.

5. **"Structured Reasoning at Scale: Foundation Models, Agents, and Evaluation"** -- Most explicit, least poetic.

My recommendation: do not force a single catchy phrase. Use a one-sentence vision statement instead (see below). The phrase can emerge later as the work matures.

---

## Suggested Bio Update

Here is a draft that integrates the research vision into the homepage bio. It replaces the current three paragraphs with three paragraphs of similar length but with a forward-looking vision added.

### Current bio (for reference):
> I build foundation models that make sense of messy, real-world data. I'm an Applied Scientist at Amazon, where I lead development of the AWS DevOps Agent -- designing long-horizon LLM agents that learn and improve from real-world trajectories.
>
> During my Ph.D. in Robotics at Carnegie Mellon University (advised by Artur Dubrawski), I created MOMENT, one of the first open-source time series foundation models, now widely adopted with over 2M downloads on HuggingFace. My research sits at the intersection of foundation models, structured data, and evaluation -- figuring out how to build AI systems that actually work reliably, and how to tell when they don't.
>
> Previously at Google Research and AWS AI Labs. I received CMU's Robotics Institute Distinguished Dissertation Award.

### Proposed revision:

> My research studies how to build AI systems that reason reliably over complex, real-world data -- and how to rigorously evaluate when they succeed or fail. I work across three interconnected areas: **foundation models** for structured data, **evaluation science** for AI systems, and **agents** that act on multimodal information in high-stakes settings.
>
> I am an Applied Scientist at Amazon, where I lead development of the [AWS DevOps Agent](https://aws.amazon.com/devops-agent/) -- a continually learning, multi-agent system for incident response and software reliability serving 1,000+ active customers. During my [Ph.D. in Robotics](https://www.ri.cmu.edu/ri-people/mononito-goswami/) at [Carnegie Mellon University](https://www.cmu.edu/) (advised by [Artur Dubrawski](https://www.ri.cmu.edu/ri-faculty/artur-w-dubrawski/)), I created [MOMENT](https://moment-timeseries-foundation-model.github.io/), one of the first open-source time series foundation models (2.5M+ downloads), and developed evaluation frameworks adopted across the time series community ([TimeSeriesGym](https://arxiv.org/abs/2505.13291), [TimeSeriesExam](https://arxiv.org/abs/2410.14752), [AQuA](https://arxiv.org/pdf/2306.09467.pdf)).
>
> Previously at [Google Research](https://research.google/teams/athena/) and [AWS AI Labs](https://aws.amazon.com/). I received CMU's [Robotics Institute Distinguished Dissertation Award](https://www.ri.cmu.edu/).

### Notes on the revision:

- **Paragraph 1** is the vision statement. It names the three areas and the connecting thread (reliable reasoning + rigorous evaluation). It is forward-looking without being grandiose.
- **Paragraph 2** is the evidence. It names the two most impressive credentials (DevOps Agent at scale, MOMENT adoption) and the evaluation work that connects them.
- **Paragraph 3** is deliberately brief -- credentials that speak for themselves.
- The bold terms (**foundation models**, **evaluation science**, **agents**) serve as visual anchors for a 10-second scan.
- The 1,000+ customers stat for DevOps Agent is included because it is a concrete industry impact metric that few academic researchers can claim.
- The revision avoids claiming "Agents for Agentic Science" or any phrase that overpromises relative to current work.

---

## Suggested Homepage Structure

### Current structure:
1. Photo + Bio (3 paragraphs)
2. News (expandable list)
3. Selected Publications (4 papers: MOMENT, Representations in TSFMs, Unsupervised Model Selection, TimeSeriesExamAgent)

### Proposed restructuring:

**1. Photo + Revised Bio** (as above)

**2. Research Highlights** (replaces "Selected Publications")

Rename this section from "Selected Publications" to "Research Highlights" and organize the selected papers by pillar. This makes the three-area structure immediately visible. Increase from 4 to 5-6 selected papers to better represent the portfolio.

Recommended selections:

*Foundation Models:*
- MOMENT (ICML 2024) -- flagship open-source TSFM, 2.5M+ downloads
- Exploring Representations and Interventions in TSFMs (ICML 2025) -- shows these models learn interpretable concepts

*Evaluation Science:*
- TimeSeriesExamAgent (ICLR 2026) -- automated benchmark generation at scale
- Unsupervised Model Selection (ICLR 2023, Spotlight) -- evaluation without ground truth
- TimeSeriesGym (Preprint 2025) -- benchmarking environment for ML engineering agents

*Agents:*
- AWS DevOps Agent (link to product page / blog post if available) -- or, if no citable publication exists, substitute with ARFBench or SpIDER

The key addition is **TimeSeriesGym**, which is currently marked `selected: true` but was not discussed in the homepage critique. It bridges evaluation and agents, making it ideal for demonstrating the pillar interaction.

**Note on JoLT (AAAI 2024, Best Student Abstract):** This paper is mentioned in the initial conceptualization as a key piece. It does show an important result (joint data, not technology, is the bottleneck for multimodal time series reasoning). However, it is a student abstract, not a full paper. Including it as a "selected" homepage paper alongside ICML/ICLR/NeurIPS full papers may create an inconsistency in perceived tier. The result is significant and should be mentioned in the bio or a research description, but may be better suited to the full publications page than the homepage highlights.

**3. News** (unchanged, continue the expandable list)

### On the Publications Page

The current thematic organization (7 themes) should be updated to reflect the three-pillar structure plus domain areas:

**Option A: Three pillars + domains**
1. Foundation Models for Structured Data (current theme, keep as-is)
2. Evaluation Science (merge current "Evaluation and Benchmarking" theme)
3. Agents and Automation (current theme, keep as-is)
4. Healthcare and Clinical AI (current theme, keep as-is)
5. Weak Supervision and Learning with Limited Labels (rename, keep as domain)
6. Earlier Work (fold "AI for Education and Social Computing" into this, or remove)

**Option B: Keep current structure**
The 7-theme structure is already well-organized and the publications page critique rated it 8/10. The risk of reorganizing is that it could look like retrofitting papers into a narrative. The pillar structure should drive the homepage and bio, not necessarily the publications page, where completeness and honest categorization matter more.

My recommendation: **Option B** for the publications page (keep current thematic organization), **use the three-pillar structure only for the homepage and bio/vision statement**. The publications page is a reference document; the homepage is a narrative document. They serve different purposes.

---

## Open Questions

### Questions Mononito should decide:

1. **Is the agent trajectory your primary identity going forward, or is it one of three co-equal threads?**
   - If agents are primary: lean into "Science of Agents" framing, accept that older work will be contextualized as "foundations that led here"
   - If co-equal: use the three-pillar structure, which honestly represents the portfolio
   - This depends on career trajectory: if pursuing a faculty position in AI/ML, the three-pillar structure shows breadth. If staying in industry and building an agents research group, the agent-centric framing is more focused.

2. **How prominently should the AWS DevOps Agent feature?**
   - It is arguably the single most impressive credential on the resume (production system, 1000+ customers, generally available AWS product). But it has no published paper. Can you write or link to a blog post, technical report, or product page that can serve as a citable reference?
   - Without a citable artifact, it is a resume line item, not a research contribution. With one, it anchors Pillar 3.

3. **Do you want to claim "healthcare" as a forward-looking domain?**
   - You have 7+ healthcare papers and deep clinical AI experience. But your current role is in DevOps/software engineering. If you are moving away from healthcare, list it as past work. If you see a future where agents do clinical reasoning over patient time series (a very real and important direction), say so explicitly.

4. **What is the forward-looking domain agenda?**
   - The three pillars describe *methodology*. The most compelling research visions also name *domains*. Some options:
     - Software engineering and reliability (natural extension of DevOps Agent, ARFBench, SpIDER)
     - Healthcare and clinical decision-making (natural extension of PhD work)
     - Scientific discovery (the "Agentic Science" aspiration -- but needs a concrete project to back it)
   - You can name 1-2 domains without committing exclusively. "I develop these methods in the context of software reliability and healthcare" is honest and compelling.

5. **Should you use the "Agentic Science" phrase at all?**
   - If you have a concrete project in mind (e.g., an agent that autonomously analyzes scientific time series data, runs experiments, generates hypotheses), then "Agents for Science" is a legitimate forward-looking direction. Name the project.
   - If it is purely aspirational, save it for grant proposals where aspiration is expected. On a personal website, promise only what you can show.

6. **How much do you want to emphasize mentorship in the narrative?**
   - 10 mentees, 3 on thesis committees, a mentoring award, mentees at ETH Zurich/Cornell/Georgia Tech -- this is an unusually strong mentoring record for someone who just finished a PhD. If pursuing faculty positions, this is a significant differentiator and should be woven into the narrative (e.g., "I build research communities around these problems").

7. **What is the role of "scalable post-training data generation (mixtures and curriculum)" in the narrative?**
   - This was mentioned in the initial conceptualization but has no corresponding publication in the YAML. Is this ongoing Amazon work? If it can be discussed publicly, it strengthens Pillar 1 (foundation models) significantly -- the data side of scaling is just as important as the model side. If it is internal, do not reference it on the website.

8. **Should you create a dedicated "Research" page separate from "Publications"?**
   - The current site has a "Research & Publications" page that is really just a publications list. Many faculty sites have a "Research" page with 2-3 paragraph descriptions of each thrust area (with figures), separate from the full publication list. This is where the three-pillar structure would live most naturally.
   - This would require writing ~200 words per pillar plus selecting representative figures. It is medium effort but high impact for anyone trying to understand what you work on.

---

## Summary

The "Science of Agents" / "Agents for Agentic Science" framing captures a real and important trajectory in your work, but it under-represents the foundation models and evaluation threads that constitute the majority of your published output. A three-pillar structure -- **Foundation Models for Structured Data**, **Evaluation Science for AI Systems**, and **Agents for Complex Reasoning** -- is more honest about the current portfolio and more clearly maps to your publications, while still positioning agents as a key and growing direction.

The connecting thread across all three pillars is the question: **How do we build AI systems that reason reliably over complex real-world data, and how do we know when they are trustworthy enough to deploy?** This is the sentence that should anchor the bio, and it is specific enough to be falsifiable and broad enough to sustain a decade of research.

The most important next steps are:
1. Decide whether agents are the primary identity or one of three co-equal threads (Question 1 above)
2. Create a citable artifact for the AWS DevOps Agent (Question 2)
3. Update the homepage bio to include a forward-looking vision statement
4. Consider adding a dedicated "Research" page with pillar descriptions
5. Decide on domain commitments (software engineering, healthcare, or both)
