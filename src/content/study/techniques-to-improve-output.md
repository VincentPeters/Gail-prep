---
title: "Techniques to Improve Gen AI Model Output"
domain: "techniques"
order: 3
summary: "Prompt engineering, grounding and RAG, model tuning, sampling parameters, and how to choose the right technique to make model output accurate, relevant, and safe."
readingMinutes: 13
---

A foundation model out of the box is powerful but generic. It does not know your company's return policy, it will happily invent a confident-sounding wrong answer, and it may format its output in a way nobody asked for. Domain 3 is about the toolkit you use to close that gap — turning a general model into one that produces **accurate, relevant, and safe** output for your specific use case. The exam loves scenario questions here: given a business problem, which technique do you reach for? Master the decision framework and you will answer most of them correctly.

## Prompt engineering: the cheapest lever

**Prompt engineering** is the practice of crafting the input you send to a model so it returns better output. It requires no code, no data, and no training — you simply change what you ask and how you ask it. Because it is the fastest and cheapest option, it is almost always where you start.

A strong prompt usually combines several ingredients:

- **Clear instruction / task** — tell the model exactly what to do ("summarize", "classify", "rewrite").
- **Context** — background information the model needs to do the job well.
- **Examples** — show the model what good output looks like.
- **Persona / role** — "You are an experienced financial analyst..." shapes tone and expertise.
- **Output format** — ask for a table, JSON, bullet points, or a specific length.
- **Constraints** — boundaries such as "in under 100 words" or "only use the information provided."

### Zero-shot, one-shot, few-shot

How many examples you include has its own vocabulary:

- **Zero-shot prompting** — no examples, just the instruction. Works well for simple, common tasks.
- **One-shot prompting** — one example to demonstrate the pattern.
- **Few-shot prompting** — several examples. This is the go-to when you need a consistent format or want to teach a nuanced pattern without any training.

### Chain-of-thought and system instructions

**Chain-of-thought prompting** asks the model to "think step by step" and show its reasoning before giving a final answer. It noticeably improves performance on math, logic, and multi-step problems because the model works through intermediate steps instead of jumping to a guess.

**System instructions** set the model's overall behavior and persona for an entire conversation — for example, "Always respond in a friendly, professional tone and never give medical advice." They act as a persistent frame, separate from the individual user prompt.

### A worked example: weak vs. improved prompt

**Weak prompt:**

> Write about our new running shoe.

The model has no idea who the audience is, how long the copy should be, what tone to use, or what facts to include. The result will be generic filler.

**Improved prompt:**

> You are a marketing copywriter for an athletic brand. Write a 3-sentence product description for the "TrailRunner X" — a lightweight trail-running shoe with a waterproof upper and extra ankle support. Target audience: weekend hikers. Tone: energetic and encouraging. Do not mention price.

The improved version supplies a **persona**, a **task**, **context** (the product's features), an **output format** (3 sentences), an **audience**, a **tone**, and a **constraint** (no price). Same model, dramatically better output — that is prompt engineering.

## Sampling parameters: tuning the dials

Even with a great prompt, you can shape output by adjusting the model's sampling settings:

- **Temperature** — controls randomness. **Higher temperature = more random/creative/varied** output; **lower temperature = more focused, deterministic, and repeatable** output. Use low temperature for factual Q&A or data extraction, higher for brainstorming or creative writing.
- **Top-k** — limits the model to choosing its next word from only the *k* most likely candidates.
- **Top-p (nucleus sampling)** — limits choices to the smallest set of words whose combined probability adds up to *p*. Both top-k and top-p narrow the pool of candidate words to control randomness.
- **Max output tokens** — caps how long the response can be (useful for cost control and preventing runaway output).
- **Safety settings** — filters that block harmful, hateful, or explicit content at chosen thresholds.

> Exam shorthand: if a question says output is "too random / off-topic / inconsistent," the fix is usually **lower the temperature**. If it is "too repetitive / not creative enough," **raise it.**

## Grounding: connecting the model to real facts

Models hallucinate — they produce fluent, confident answers that are simply wrong — because they generate from learned patterns, not a live database of truth. **Grounding** fixes this by connecting the model to **authoritative external sources** so its answers are based on real data. Grounding is one of the most effective ways to **reduce hallucinations**.

Two common Google Cloud approaches:

- **Grounding with Google Search** — the model pulls fresh facts from the public web, ideal for current events and recent information beyond its training cutoff.
- **Grounding on enterprise data via Vertex AI Search** — the model answers from *your* documents, policies, and databases.

## RAG: retrieval-augmented generation

**Retrieval-Augmented Generation (RAG)** is the most common grounding architecture. At the moment a user asks a question, the system:

1. Searches a knowledge base for the most relevant documents.
2. Inserts (augments) those documents into the prompt as context.
3. Asks the model to answer *using that retrieved context*.

The retrieval step usually relies on **embeddings** and **vector search**. **Embeddings** are numeric vector representations that capture the *meaning* of text; similar meanings produce similar vectors. Your documents are converted to embeddings and stored in a **vector database**. At query time the user's question is also embedded, and **vector search** finds the closest (most semantically similar) chunks — this is *semantic search*, matching by meaning rather than exact keywords.

RAG's big advantage: it keeps answers **current and grounded without retraining the model**. Update the knowledge base and the answers update instantly. It is the standard answer when a business needs the model to reason over proprietary or frequently-changing information.

## Model tuning / fine-tuning: changing the model itself

When prompting is not enough, you can **fine-tune** — further-train a base model on your own labeled examples so it specializes. Unlike prompting and RAG, fine-tuning **actually changes the model's weights**. It is the right choice when you need consistent style, tone, format, or domain behavior that prompting cannot reliably produce — and you have quality labeled data to train on.

Related concepts:

- **Parameter-efficient tuning** (e.g. **adapters / LoRA**) — tunes only a small part of the model instead of all of it, making tuning far cheaper and faster.
- **Distillation** — trains a smaller, cheaper "student" model to imitate a larger one, reducing cost and latency.

Fine-tuning teaches *behavior and style*; it does **not** reliably teach new facts — for facts that change or must be cited, use RAG.

## Choosing an approach (the key exam framework)

This decision tree is the heart of Domain 3:

| Technique | What it does | When to use it | Cost / effort |
|---|---|---|---|
| **Prompt engineering** | Improves the input; model unchanged | Always start here; simple behavior and format tweaks | Lowest — instant, no data |
| **RAG / grounding** | Adds retrieved external facts at query time; model unchanged | Need current or proprietary facts, or to reduce hallucinations, without retraining | Medium — needs a knowledge base + vector search |
| **Fine-tuning** | Retrains the model on labeled data; model changed | Need consistent style/format/domain behavior prompting can't achieve, and you have quality labeled data | Highest — needs data, compute, ML effort |

The rule of thumb: **prompt first, then RAG, then tune.** Start cheap. Only escalate when the simpler option genuinely cannot meet the need.

## Model selection trade-offs

Choosing the *model* matters too. Balance:

- **Capability / quality vs. cost vs. latency** — a powerful model like **Gemini Pro** gives higher quality; a fast, cheap model like **Gemini Flash** gives speed and lower cost for high-volume or simple tasks.
- **Context window size** — how much text the model can consider at once (important for long documents or big RAG contexts).
- **Multimodal needs** — whether you need image, audio, or video input, not just text.

## Evaluation

Improvement is iterative, so you must measure it. Evaluation combines:

- **Human review** — people judge quality, tone, and correctness.
- **Automated metrics** — scores computed at scale.
- **Groundedness checks** — verifying the answer is actually supported by the provided sources (critical for RAG).

Then you **iterate on the prompt**, data, or configuration and re-measure.

## Key terms

- **Prompt engineering** — crafting inputs (instruction, context, examples, persona, format, constraints) to get better output.
- **Zero- / one- / few-shot** — prompting with zero, one, or several examples.
- **Chain-of-thought** — asking the model to reason step by step.
- **System instruction** — a persistent directive that sets the model's overall behavior.
- **Temperature** — randomness dial: high = creative, low = focused/deterministic.
- **Top-k / Top-p** — settings that limit which candidate next-words the model may choose.
- **Max output tokens** — cap on response length.
- **Grounding** — connecting the model to authoritative external facts to reduce hallucination.
- **RAG** — retrieving relevant documents at query time and adding them to the prompt.
- **Embeddings** — numeric vectors capturing meaning; enable semantic search.
- **Vector search / vector database** — finds and stores embeddings by similarity.
- **Fine-tuning** — further-training a base model on labeled data; changes the model.
- **Parameter-efficient tuning (LoRA / adapters)** — tuning only a small part of the model.
- **Distillation** — creating a smaller, cheaper model that imitates a larger one.

## Exam tips

> **Prompt → RAG → tune.** Always start with the cheapest technique. Escalate only when the simpler one cannot meet the need.

> **Grounding and RAG reduce hallucinations** by basing answers on real, authoritative data. If a scenario mentions "wrong / made-up answers" or "needs proprietary or current facts," the answer is usually grounding/RAG.

> **Fine-tuning changes the model; prompting and RAG do not.** Choose fine-tuning for consistent style/format/domain behavior when you have quality labeled data — not to inject changing facts.

> **Temperature:** lower = focused and factual, higher = creative and varied. Match the dial to the task.

> **Few-shot** teaches a pattern with examples; **chain-of-thought** improves multi-step reasoning by asking the model to think step by step.

> **Model choice is a trade-off:** quality (Gemini Pro) vs. speed and cost (Gemini Flash), plus context window and multimodal needs.
