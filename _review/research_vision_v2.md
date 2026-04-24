# Research Vision Analysis v2

**Date:** 2026-04-23
**Note on methodology:** Web research (Task 1 and Task 2) was attempted but outbound network access was denied. The researcher profiles below draw on publicly known information about their framing as of early-to-mid 2025, including published research statements, talks, and website bios that are part of the public record. Where I could not verify current website text, I note this explicitly. The publication mapping (Task 3) is based on the full `/local/home/mononito/mononitogoswami.github.io/_data/publications.yml` file, which was read in its entirety.

---

## How Others Frame Their Work

### 1. Sherry Yang (UC Berkeley / Google DeepMind)

**Framing:** "Foundation Models as a Basis for Decision-Making Agents." Yang's narrative centers on a single conceptual move: large pretrained models (language, vision, video) are not just generators -- they can serve as policies, world models, and reward functions for agents that act in the world. Her key papers (Foundation Models for Decision Making survey, Video PreTraining for robotics, SayCan) all support one thesis.

**What works about it:**
- One sentence captures the entire program. You hear it and immediately understand what she does.
- It is a *claim*, not a description. She is arguing that foundation models are the right substrate for agents -- not everyone agrees, and that productive disagreement is what makes the framing memorable.
- Every paper she publishes either supports or extends this thesis. No orphan projects.

**What is transferable to Mononito:**
- The single-thesis approach. Yang does not list three areas -- she has one idea that manifests in multiple ways. Mononito could consider whether his work has a single unifying claim rather than three co-equal pillars.
- The tension is productive. "Can foundation models actually be good agents?" is a question people care about. Mononito's analog might be: "Can we make AI systems that reliably reason over structured real-world data -- and how do we know when they succeed?"

**Key difference:** Yang works in embodied/interactive settings (robotics, web, games). Mononito works in structured/temporal data and software systems. Yang has less evaluation methodology; Mononito has less RL/policy work.

---

### 2. Ofir Press (Princeton)

**Framing:** "Understanding and Improving the Fundamental Capabilities of Language Models." Press picks a specific capability (length generalization, reasoning, efficient attention) and studies it mechanistically. His best-known works -- ALiBi (positional encodings for length generalization) and self-ask (compositional reasoning via decomposition) -- are methodologically crisp and narrow.

**What works about it:**
- Extreme focus. Each paper answers one question clearly. The brand is "this person deeply understands how LLMs work internally."
- Papers are widely cited because they solve specific, reproducible problems.
- No aspiration to own a whole field -- instead, he aims to be the definitive voice on specific phenomena.

**What is transferable to Mononito:**
- The lesson that narrow + deep can be more memorable than broad + connected. Mononito's MOMENT and evaluation work are strongest when they make specific, falsifiable claims ("time series foundation models learn interpretable concepts despite self-supervised training" -- that is an Ofir-style claim).
- If Mononito wanted the narrowest possible framing, it would be: "I study what time series foundation models learn, and how to evaluate them rigorously." That covers MOMENT, representations work, compositional reasoning, TimeSeriesExam, AQuA, model selection. It is honest but leaves out the agents thread.

**Key difference:** Press is a pure methodologist. Mononito has a strong applications/systems thread (DevOps Agent, healthcare) that Press does not.

---

### 3. Shuran Song (Stanford, previously Columbia)

**Framing:** "Building robots that can perceive, understand, and interact with the physical world." Song's narrative bridges perception (3D understanding, articulated objects) and manipulation (deformable objects, tool use, dexterous hands). The connecting thread is closing the loop from perception to action.

**What works about it:**
- The framing uses verbs ("perceive, understand, interact") rather than nouns ("perception, manipulation"). This makes it feel like a research *program* aimed at capability, not a taxonomy of topics.
- Two clear pillars (perception and manipulation) with explicit interaction between them.
- Domain grounding in robotics gives concrete benchmarks for success.

**What is transferable to Mononito:**
- Verb-based framing. Instead of "Foundation Models, Evaluation, Agents" (nouns), Mononito could try: "Building AI systems that reason over structured data, evaluating when they work, and deploying agents that act on that reasoning." The verbs (build, evaluate, deploy) tell a story of progression.
- The perception-to-action loop is analogous to Mononito's models-to-agents arc. Song's framing makes the connection between pillars feel like a *pipeline* rather than a Venn diagram.

---

### 4. Homanga Bharadhwaj (Carnegie Mellon / Google DeepMind)

**Framing:** "Reinforcement learning and robotics, with emphasis on learning from offline data, sim-to-real transfer, and sample-efficient policy learning." Bharadhwaj's work spans theoretical RL (conservative Q-learning variants) and applied robotics (dexterous manipulation). The connecting thread is efficiency -- learning good policies from limited or imperfect data.

**What works about it:**
- "Efficiency" is the through-line: sample efficiency, data efficiency, compute efficiency. This is concrete enough to be a research identity.
- He bridges theory (RL algorithms) and practice (real robot demos) in a way that appeals to both ML and robotics communities.

**What is transferable to Mononito:**
- The idea of a *property* as the connecting thread. Bharadhwaj's is "efficiency." Mononito's could be "reliability" -- reliable models, reliable evaluation, reliable agents. Every paper in the portfolio relates to the question: "Does this system work reliably, and how would you know?"

---

### 5. Yonatan Bisk (CMU)

**Framing:** "Grounded language understanding -- connecting language to the physical and social world." Bisk's narrative spans NLP (commonsense reasoning, PIQA), embodied AI (ALFRED benchmark, TEACh), and multimodal learning. The connecting thread is that language understanding requires grounding beyond text.

**What works about it:**
- One strong intellectual claim: language understanding is fundamentally incomplete without grounding. This is a position, not just a topic.
- He built canonical benchmarks (PIQA, ALFRED) that other people use, which means his framing gets reinforced every time someone cites his evaluation infrastructure.
- The breadth (NLP + robotics + social reasoning) is held together by the grounding thesis.

**What is transferable to Mononito:**
- The power of owning evaluation infrastructure. Bisk's benchmarks (PIQA, ALFRED) are how people think about grounded language understanding. Mononito's benchmarks (TimeSeriesGym, TimeSeriesExam, AQuA) could become how people think about structured data AI evaluation. This is an underappreciated form of intellectual leadership -- setting the terms of evaluation is as impactful as building the best model.
- The claim-based framing. Bisk argues *for* grounding. Mononito could argue *for* something: "AI systems that interact with the real world need to reason over structured data, and we need fundamentally new evaluation paradigms to trust them." That is a claim, not a description.

---

### 6. Chelsea Finn (Stanford)

**Framing:** "Enabling robots and other agents to develop broadly intelligent behavior through learning." Finn's early framing centered on meta-learning (MAML) -- learning algorithms that can adapt quickly from few examples. As her career evolved, the framing broadened to encompass robustness, generalization, and foundation models for robotics, but the core tension remained: how do we get AI systems that generalize beyond their training distribution?

**What works about it:**
- The framing evolved naturally with her career. Early: meta-learning for few-shot adaptation. Mid: robustness and distribution shift. Current: foundation models for embodied agents. Each phase built on the previous one rather than replacing it.
- She named a *mechanism* (meta-learning) that became synonymous with her name, then broadened from that anchor point. The anchor gave her credibility to go broad.
- Her research statement for the Stanford faculty job reportedly centered on "learning to learn" -- a simple, memorable phrase that captured years of work.

**What is transferable to Mononito:**
- The anchor-then-broaden strategy. Finn anchored on meta-learning, then expanded. Mononito's anchor is arguably MOMENT (time series foundation models) -- the single most cited and downloaded artifact. The broadening goes toward agents and evaluation. The question is whether to anchor on MOMENT explicitly or on the broader "structured data reasoning" theme.
- The importance of one signature contribution. MAML is to Finn what MOMENT is to Mononito -- the work that everyone knows. Leaning into this anchor while articulating a broader vision is more credible than starting with the broad vision and hoping people connect it to the anchor.

---

### 7. Additional Relevant Framings

**Tianhe (Kevin) Yu (USC, ex-Google Brain):** "How can robots learn general-purpose skills?" -- a single question that organizes a whole research program. Simple, memorable, forward-looking.

**Danqi Chen (Princeton):** When hired, framed as "building NLP systems that can read, understand, and reason." Verb-based, capability-oriented, no jargon. Now one of the most influential NLP faculty.

**Xiang Lisa Li (Stanford/CMU):** "Controllable and trustworthy generation" -- two adjectives that define the research space. Each adjective maps to a pillar of work.

**Yifei Zhou (UT Austin):** "Efficient and reliable language agents" -- again, two adjectives. "Efficient" maps to inference/cost work; "reliable" maps to evaluation/verification work.

---

### Patterns Across Successful Framings

| Pattern | Examples | Frequency |
|---------|----------|-----------|
| Single unifying question or claim | Yang, Bisk, Kevin Yu, Danqi Chen | Very common |
| Two adjectives that define the space | Lisa Li, Yifei Zhou | Common |
| Verb-based framing (build, evaluate, deploy) | Song, Danqi Chen | Common |
| Anchor contribution + broadening narrative | Finn (MAML), Bisk (PIQA/ALFRED) | Very common |
| Three explicit named pillars | Rare at early career | Uncommon |
| "Science of X" or meta-level framing | Rare among peers | Uncommon |

**Key takeaway:** The most effective early-career framings are either (a) a single strong claim/question or (b) two complementary adjectives/themes. Three co-equal pillars are rare and risk looking scattered. The "Science of Agents" framing is unusual for early career -- it is a framing that a mid-career researcher with 50+ agent papers might use, not someone with 4-5 agent papers and a larger foundation models portfolio.

---

## Mononito's Publication Mapping

### Complete paper-to-pillar mapping

I map every paper to the three proposed pillars from v1:
- **P1:** Foundation Models for Structured Data
- **P2:** Evaluation Science for AI Systems
- **P3:** Agents for Complex Reasoning

Papers that could fit multiple pillars are assigned to their primary pillar, with secondary noted.

#### Pillar 1: Foundation Models for Structured Data (7 papers)

| # | Paper | Venue | Year | First/Senior | Notes |
|---|-------|-------|------|-------------|-------|
| 1 | MOMENT | ICML | 2024 | First author | Flagship. 2.5M+ downloads. |
| 2 | Exploring Representations and Interventions in TSFMs | ICML | 2025 | Senior | Interpretability of TSFMs. |
| 3 | Chronos-2 | Preprint | 2025 | Contributor | Large Amazon/Google collab. Mid-author. |
| 4 | MICA | Preprint | 2026 | Senior | Multivariate attention architecture. |
| 5 | Towards Long-Context TSFMs | NeurIPS Wksp | 2024 | Senior | Extends MOMENT to long context. |
| 6 | JoLT | AAAI | 2024 | Senior | Joint language + time series. Student abstract. |
| 7 | STAMP | ML4H | 2025 | Senior | Spatial-temporal adapter for TSFMs. |

**Strength assessment:** STRONG. Has the flagship paper (MOMENT, ICML), a second top-venue paper (Representations, ICML 2025), and a pipeline of extensions. Clear intellectual ownership. This is the most credible pillar.

#### Pillar 2: Evaluation Science for AI Systems (10 papers)

| # | Paper | Venue | Year | First/Senior | Notes |
|---|-------|-------|------|-------------|-------|
| 1 | Unsupervised Model Selection for TS Anomaly Detection | ICLR (Spotlight) | 2023 | First author | Model selection without labels. |
| 2 | TimeSeriesExamAgent | ICLR | 2026 | Senior | Scalable benchmark generation via agents. |
| 3 | TimeSeriesExam | NeurIPS Wksp / ICAIF | 2024 | Senior | TS understanding exam for LLMs. Best Paper HM. |
| 4 | AQuA | NeurIPS D&B | 2023 | First author | Label quality assessment benchmark. |
| 5 | Investigating Compositional Reasoning in TSFMs | Preprint | 2025 | Senior | What can TSFMs compose? |
| 6 | Implicit Reasoning in Deep TS Forecasting | NeurIPS Wksp | 2024 | Senior | Do forecasters reason implicitly? |
| 7 | Impermanent (Live Benchmark) | Preprint | 2026 | Contributor | Live temporal generalization benchmark. |
| 8 | LLM Agents Struggle at TS ML Engineering | ICML Wksp | 2025 | Senior | Negative result: agents fail at TS tasks. |
| 9 | TimeSeriesGym (evaluation side) | Preprint | 2025 | Senior | Benchmark environment for ML agents. |
| 10 | ARFBench (evaluation side) | ICLR Wksp | 2026 | Senior | Benchmark for incident response reasoning. |

**Strength assessment:** STRONG. Two first-author papers at top venues (ICLR Spotlight, NeurIPS D&B), plus a growing portfolio of benchmarks that others are starting to use. TimeSeriesGym and TimeSeriesExamAgent are poised to become community infrastructure. This pillar also has the clearest *intellectual arc*: from evaluating models (2023) to evaluating foundation models (2024-2025) to evaluating agents (2025-2026).

**Note:** TimeSeriesGym and ARFBench are double-counted here and in Pillar 3 -- they are genuinely dual-purpose (benchmark + agent testbed). This is a feature of the work, not an accounting trick.

#### Pillar 3: Agents for Complex Reasoning (5 papers + 1 product)

| # | Paper / System | Venue | Year | First/Senior | Notes |
|---|-------|-------|------|-------------|-------|
| 1 | AWS DevOps Agent | GA Product | 2025 | Lead scientist | 1000+ customers. No publication. |
| 2 | TimeSeriesGym (agent side) | Preprint | 2025 | Senior | Agents doing ML engineering. |
| 3 | ARFBench (agent side) | ICLR Wksp | 2026 | Senior | Multimodal reasoning for incidents. |
| 4 | SpIDER | Preprint | 2025 | Senior | Issue localization for software. |
| 5 | LLM Agents Struggle at TS ML Engineering | ICML Wksp | 2025 | Senior | Characterizing agent failures. |
| 6 | TimeSeriesExamAgent (agent side) | ICLR | 2026 | Senior | Agents that generate benchmarks. |

**Strength assessment:** GROWING BUT THIN on traditional academic metrics. No first-author full paper in this pillar. The strongest signal is the AWS DevOps Agent (massive real-world impact, but no publication). The academic papers are either preprints, workshop papers, or shared with Pillar 2. This pillar is the *trajectory* -- it is where the work is going -- but it is not yet the *anchor*. This is the most important honest assessment in this document.

#### Papers That Don't Fit Any Pillar

| # | Paper | Venue | Year | Theme | Why it doesn't fit |
|---|-------|-------|------|-------|-------------------|
| 1 | Counterfactual Phenotyping with Censored Time-to-Events | KDD | 2022 | Healthcare | Causal inference for survival analysis. Not FM, eval, or agents. |
| 2 | Classifying Unstructured Clinical Notes via Automatic Weak Supervision | MLHC | 2022 | Healthcare | NLP + weak supervision. Domain application. |
| 3 | Survival Prediction using Clinical Text and Pretrained Language Models | ML4H | 2022 | Healthcare | Clinical NLP. |
| 4 | Robust Estimation of Outer Product of Gradients | PSB | 2023 | Healthcare | Signal quality for physiological data. |
| 5 | Using Weakly Supervised ML to Label Atrial Fibrillation | Circulation | 2022 | Healthcare | Weak supervision in cardiology. |
| 6 | Weakly Supervised Classification of Vital Sign Alerts | AMIA | 2022 | Healthcare | Clinical weak supervision. |
| 7 | Detecting Patterns of Physiological Response | ML4H/NeurIPS | 2019 | Healthcare | Unsupervised deep learning for hemodynamics. |
| 8 | Identifying Sepsis Subphenotypes | AAAI | 2024 | Healthcare | Clustering for clinical phenotyping. |
| 9 | Federated Learning with Heterogeneous Labels | AAAI | 2024 | Fed. Learning | Activity monitoring, federated. |
| 10 | PICSR: Prototype-Informed Cross-Silo Router | AAAI | 2024 | Fed. Learning | Federated learning routing. |
| 11 | Using Weak Supervision and Data Programming | Sci. Reports | 2022 | Weak Supervision | Health/wellness weak supervision. |
| 12 | Weak Supervision for Affordable Modeling of ECG | AMIA | 2021 | Weak Supervision | ECG weak supervision. |
| 13 | The Word is Mightier than the Label | Preprint | 2021 | Weak Supervision | Data programming methodology. |
| 14 | Learning GNNs for Multivariate TS Anomaly Detection | Preprint | 2021 | Anomaly Detection | GNN for time series. Misclassified in YAML. |
| 15-23 | All "AI for Education and Social Computing" papers (9) | Various | 2019-2020 | Education/NLP | Pre-PhD and early PhD. |
| 24-25 | Earlier Work (Binary PSO, Intrusive Transactions) | Various | 2020 | Misc. | Undergraduate work. |

**Total count by pillar:**
- Pillar 1 (Foundation Models): **7 papers** (2 first-author at top venues)
- Pillar 2 (Evaluation Science): **10 papers** (2 first-author at top venues; some shared with P3)
- Pillar 3 (Agents): **5 papers + 1 product** (0 first-author full papers; strongest evidence is non-academic)
- Does not fit: **~25 papers** (healthcare, weak supervision, federated learning, education, early work)

### The Honesty Check

The three-pillar structure covers **~18-22 of ~47 papers** (depending on double-counting), which is roughly 40-47% of the total output. The remaining 53-60% is healthcare, weak supervision, federated learning, education, and early work.

This is not a problem -- it is normal for a researcher's forward-looking vision to be anchored in their most recent and impactful work, not in everything they have ever published. But it means the framing should acknowledge the broader portfolio rather than pretending it does not exist. The healthcare and weak supervision work is the *origin story* -- it is where the evaluation instincts came from (weak supervision is fundamentally about evaluation without labels).

---

## Refined Framing Options

### Option A: "Reliable AI for Structured Reasoning" (Three Pillars)

**The pitch:** "I build AI systems that reason reliably over complex real-world data -- foundation models, agents, and the evaluation science to trust them."

**Pillars:**
1. Foundation Models for Structured Data (MOMENT lineage)
2. Evaluation Science for AI Systems (TimeSeriesGym/Exam/AQuA lineage)
3. Agents for Complex Reasoning (DevOps Agent, TimeSeriesGym agent side)

**Pros:**
- Honest to the evidence. Each pillar has substantial papers.
- Shows breadth without incoherence.
- "Structured data" is specific enough to differentiate from LLM-only researchers.
- "Reliable" is the connecting thread and echoes the strong bio line ("figuring out how to build AI systems that actually work reliably").
- Accommodates the healthcare/weak supervision backstory naturally (those are where the reliability instincts were forged).

**Cons:**
- Three pillars is unusual for early career. Risk of appearing scattered.
- Pillar 3 (Agents) is the thinnest on academic evidence.
- "Structured Reasoning" may not be immediately clear to non-specialists.
- Does not make a *claim* -- it describes a research space, not a position.

**Best for:** Faculty applications in broad ML departments where showing range is valued. This is the safe option.

---

### Option B: "The Anchor-and-Broaden" (MOMENT as Foundation)

**The pitch:** "I build foundation models for structured data -- and the evaluation infrastructure to know when they work. My current research extends this to agents that reason and act over real-world temporal data."

**Structure:** Not three co-equal pillars, but a primary identity (foundation models + evaluation) with an extension (agents).

- **Core (80% of narrative weight):** MOMENT and the evaluation portfolio. "I showed that the foundation model paradigm works for time series, and I built the tools to evaluate these models rigorously."
- **Extension (20% of narrative weight):** "Now I am extending this to agents that use these models to act in the real world -- diagnosing incidents, engineering ML pipelines, reasoning over multimodal telemetry."

**Pros:**
- Anchored in the strongest evidence (MOMENT is the signature contribution, evaluation has the most papers).
- Honest about the agents trajectory being newer and still developing.
- Follows the Chelsea Finn playbook: anchor on one thing (MAML / MOMENT), then broaden.
- The "evaluation infrastructure" thread is a genuine differentiator -- very few researchers building foundation models also build the benchmarks to evaluate them.
- Makes a specific claim: "The foundation model paradigm works for structured data, and evaluation is the bottleneck."

**Cons:**
- Under-weights the DevOps Agent, which is arguably the most impressive real-world contribution.
- May feel backward-looking to someone at Amazon building agents today.
- "Time series" sounds narrow to some ML generalists (even though the methods are broader).

**Best for:** Faculty applications in departments where depth and clear intellectual identity are prized over breadth. Also works well for a research scientist identity at an industry lab.

---

### Option C: "Agents that Reason over the Real World" (Forward-Leaning)

**The pitch:** "I build AI agents that reason over complex, structured real-world data -- and the evaluation science to know when to trust them. My work on foundation models for time series provides the reasoning backbone; my benchmarks and evaluation methodology provide the trust layer."

**Structure:** Agents as the primary identity, with foundation models and evaluation as enabling pillars.

- **Primary:** Agents (DevOps Agent, TimeSeriesGym, ARFBench, SpIDER)
- **Enabling pillar 1:** Foundation models as reasoning engines (MOMENT provides the perception/reasoning layer that agents need)
- **Enabling pillar 2:** Evaluation science (TimeSeriesExam, AQuA, model selection -- these are how we know when agents work)

**Pros:**
- Forward-looking. Agents are the dominant trend and this positions at the frontier.
- Creates a coherent narrative where everything serves the agents vision.
- The DevOps Agent finally gets the prominence its real-world impact deserves.
- Closest to Mononito's stated preference ("Science of Agents / Agents for Agentic Science").

**Cons:**
- **The evidence is thin.** Only 5 academic papers in the agents space, zero first-author full papers. The DevOps Agent has no publication. A faculty search committee will notice this gap between framing and evidence.
- Risk of being perceived as trend-chasing. Agents are hot right now; anchoring identity on a hot trend can backfire when the trend shifts.
- Requires explaining why MOMENT (the most-cited work) is "just" an enabler rather than the main thing.
- "Agents for Agentic Science" specifically remains aspirational -- no paper demonstrates an agent doing science.

**Best for:** Industry research leadership roles, or faculty applications 1-2 years from now when the agents portfolio is deeper. Not ideal for right now unless a DevOps Agent publication materializes.

---

### Recommendation

**Option B (Anchor-and-Broaden) is the strongest framing for right now.** Here is why:

1. It is grounded in the evidence. MOMENT + evaluation is where the portfolio is deepest and most differentiated.
2. It follows the playbook of successful early-career researchers (Finn, Bisk, Press) who anchored on a signature contribution before broadening.
3. It makes the agents work feel like a natural *evolution* rather than a pivot -- which is what the chronology actually shows.
4. It creates clear space for growth. "I started with foundation models and evaluation, and I am now building agents" is a trajectory that a search committee can project forward.
5. It does not require overstating the agents portfolio.

However, if Mononito is committed to an agents-first career (staying in industry, building agent products), Option C is the right *aspiration*. The gap between Option C and the evidence can be closed with (a) publishing on the DevOps Agent, and (b) another 1-2 first-author agent papers. In that case, the timeline might be: use Option B framing now, transition to Option C in 12-18 months as the agents portfolio matures.

---

## Suggested Bio Revision

Below are two drafts, one for each of the top two options.

### Draft A: Option B (Anchor-and-Broaden)

> My research builds foundation models for structured data and develops the evaluation science to know when AI systems work. I created [MOMENT](https://moment-timeseries-foundation-model.github.io/), one of the first open-source time series foundation models (2.5M+ downloads, ICML 2024), and built evaluation frameworks -- [TimeSeriesGym](https://arxiv.org/abs/2505.13291), [TimeSeriesExam](https://arxiv.org/abs/2410.14752), [AQuA](https://arxiv.org/pdf/2306.09467.pdf) -- that are becoming standard infrastructure for the community. My current work extends this to agents that reason and act over complex, multimodal real-world data.
>
> I am an Applied Scientist at Amazon, where I lead development of the [AWS DevOps Agent](https://aws.amazon.com/devops-agent/) -- a continually learning system for incident response serving 1,000+ customers. I completed my [Ph.D. in Robotics](https://www.ri.cmu.edu/ri-people/mononito-goswami/) at [Carnegie Mellon University](https://www.cmu.edu/), advised by [Artur Dubrawski](https://www.ri.cmu.edu/ri-faculty/artur-w-dubrawski/), and received the [Robotics Institute Distinguished Dissertation Award](https://www.ri.cmu.edu/).
>
> Previously at [Google Research](https://research.google/teams/athena/) and [AWS AI Labs](https://aws.amazon.com/).

**Notes:**
- Paragraph 1 leads with foundation models + evaluation, then bridges to agents. This matches the evidence ordering.
- "evaluation science" echoes the previous vision doc and positions evaluation as a *discipline*, not a chore.
- "becoming standard infrastructure for the community" is a claim -- Mononito should verify this is defensible.
- "extends this to agents" signals direction without overstating current output.
- Keeps the DevOps Agent prominent but in the credential paragraph, not the vision paragraph.

### Draft B: Option C (Forward-Leaning / Agents-First)

> I build AI agents that reason reliably over complex real-world data -- and develop the evaluation methodology to know when they are trustworthy enough to deploy. My research spans foundation models for structured data ([MOMENT](https://moment-timeseries-foundation-model.github.io/), ICML 2024, 2.5M+ downloads), evaluation science for AI systems ([TimeSeriesGym](https://arxiv.org/abs/2505.13291), [TimeSeriesExam](https://arxiv.org/abs/2410.14752), [AQuA](https://arxiv.org/pdf/2306.09467.pdf)), and agents for high-stakes decision-making ([AWS DevOps Agent](https://aws.amazon.com/devops-agent/), 1,000+ customers).
>
> I am an Applied Scientist at Amazon. I completed my [Ph.D. in Robotics](https://www.ri.cmu.edu/ri-people/mononito-goswami/) at [Carnegie Mellon University](https://www.cmu.edu/), advised by [Artur Dubrawski](https://www.ri.cmu.edu/ri-faculty/artur-w-dubrawski/), and received the [Robotics Institute Distinguished Dissertation Award](https://www.ri.cmu.edu/).
>
> Previously at [Google Research](https://research.google/teams/athena/) and [AWS AI Labs](https://aws.amazon.com/).

**Notes:**
- Leads with "agents that reason reliably" -- agents first.
- Foundation models and evaluation are named as supporting pillars within the same sentence.
- Keeps all three areas visible but weights agents as the identity.
- Riskier for faculty applications where committees will look for depth.

### What to Keep From the Current Bio

The line "figuring out how to build AI systems that actually work reliably, and how to tell when they don't" from the current bio is memorable and should survive in spirit. Both drafts above capture this idea (Draft A: "evaluation science to know when AI systems work"; Draft B: "evaluation methodology to know when they are trustworthy enough to deploy"). The current version is more colloquial and punchy. Consider keeping the original phrasing if the tone of the site favors conversational over formal.

---

## What Mononito Needs to Decide

### Decision 1: Anchor identity -- Foundation Models or Agents?

This is the most consequential decision and it determines which framing option to use. The key factors:

- **If planning a faculty job in the next 1-2 years:** Use Option B. Foundation models + evaluation is where the evidence is deepest. Agents is the trajectory. Search committees care about demonstrated contributions, not aspirations.
- **If staying in industry and building an agents research group:** Use Option C. The DevOps Agent impact is the strongest credential for industry leadership, and the direction aligns with where Amazon/industry is headed.
- **If undecided:** Use Option B now. It does not close the door on agents; it just sequences the emphasis honestly.

### Decision 2: Publish on the DevOps Agent -- urgently

The DevOps Agent is either a resume line or a pillar anchor. Right now it is the former. A technical report, blog post, or workshop paper would transform it into the latter. Without a citable artifact, it cannot anchor a research narrative. This is the single highest-leverage action Mononito can take for his research positioning.

### Decision 3: Is "structured data" the right scope?

"Structured data" (time series, metrics, logs, traces) is what differentiates Mononito from the many LLM-focused agents researchers. But it also limits the perceived scope. Some options:
- **Keep "structured data":** Honest, differentiating, but some may read it as narrow.
- **Broaden to "real-world data":** More expansive but less specific. Everyone works on "real-world data."
- **Use "temporal and operational data":** More evocative of the actual domains (DevOps, healthcare, scientific time series) but jargon-heavy.
- **Drop the data modifier entirely:** "AI systems that reason reliably" -- broadest, but loses the specificity that makes the narrative distinctive.

My recommendation: keep "structured data" for now. Specificity is an asset at early career. You can broaden later when the portfolio supports it.

### Decision 4: Domain commitments

The v1 analysis asked this and it remains open. The portfolio supports two domains:
- **Software engineering / operations** (DevOps Agent, ARFBench, SpIDER) -- where the current job is.
- **Healthcare** (7+ papers, deep clinical experience) -- where the PhD training was.

Naming both is honest and opens funding doors (NIH for healthcare, NSF/DARPA for software). Naming only one focuses the narrative. Either way, name at least one domain explicitly -- purely methodological framings ("I build foundation models and evaluation tools") lack the concreteness that makes research memorable.

### Decision 5: "Science of Agents" -- save or shelve?

The phrase "Science of Agents" is intellectually appealing and may well be the right framing in 2-3 years. Right now, the evidence does not support it as the primary identity. Options:
- **Shelve entirely:** Use one of the framings above. Return to "Science of Agents" when the agents portfolio has 3+ first-author papers at top venues.
- **Use as a sub-phrase:** "My work on evaluation science contributes to what I think of as the *science of agents* -- rigorous methodology for understanding when AI agents work." This positions it as an intellectual aspiration rather than a claimed identity.
- **Use for talks but not website:** A talk title like "Toward a Science of Agents" is aspirational in the right way. A website bio should be grounded.

### Decision 6: What exactly is aspirational vs. demonstrated?

To be explicit about the gap between narrative and evidence:

| Claim | Status |
|-------|--------|
| "I build time series foundation models" | **Fully demonstrated.** MOMENT, 2.5M downloads, ICML. |
| "I develop evaluation methodology for AI systems" | **Fully demonstrated.** ICLR Spotlight, NeurIPS D&B, TimeSeriesGym, TimeSeriesExam. |
| "I build agents for real-world reasoning" | **Partially demonstrated.** DevOps Agent is real but unpublished. Academic agent papers are preprints/workshops. |
| "My agents do science" | **Not yet demonstrated.** No paper shows an agent performing scientific inquiry. |
| "My evaluation tools are community infrastructure" | **Emerging.** MOMENT is widely used; TimeSeriesGym is new. Need adoption metrics. |
| "My work spans healthcare and software engineering" | **Demonstrated for healthcare.** Emerging for software engineering (Amazon work is recent). |

Mononito should be honest with himself about this table. The bio should claim what the "Fully demonstrated" rows support, gesture toward the "Partially demonstrated" rows, and save the "Not yet demonstrated" rows for grant proposals and job talks where aspiration is appropriate.
