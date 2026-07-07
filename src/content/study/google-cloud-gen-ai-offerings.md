---
title: "Google Cloud's Generative AI Offerings"
domain: "offerings"
order: 2
summary: "Google's end-to-end gen AI stack — Gemini models, Vertex AI, Model Garden, Agent Builder, Workspace, NotebookLM, and the TPU/GPU infrastructure beneath it."
readingMinutes: 16
---

This domain is the single largest slice of the exam (~35%), and it is mostly about **matching a business need to the right Google Cloud product**. You will not be asked to write code. You will be asked things like *"A retailer wants employees to search across internal documents using natural language — which product?"* Your job is to know the portfolio well enough to pick confidently. This guide walks the whole stack from the models at the center out to the chips underneath.

## The Gemini model family

**Gemini** is Google's family of **natively multimodal** foundation models. "Natively multimodal" means a single model was built from the ground up to understand and combine text, images, audio, video, and code — not a text model with add-ons bolted on. Gemini is the engine behind the consumer **Gemini app**, is embedded across Google's products, and is available to build with via API.

Gemini comes in **variants that trade capability against speed and cost**:

| Variant | Best for | Trade-off |
| --- | --- | --- |
| **Gemini Pro** | The most capable, complex reasoning, hard multi-step tasks | Highest quality, but slower and more expensive |
| **Gemini Flash** | High-volume, latency-sensitive, cost-sensitive work (chat, summarizing, classification) | Fast and low-cost, with slightly less headroom on the hardest tasks |

The exam loves this distinction. Rule of thumb: **need the smartest answer → Pro; need fast and cheap at scale → Flash.** Both are the *same family*, so you can prototype on one and switch.

You can access Gemini two ways, which brings us to the most important comparison in this domain.

## Google AI Studio vs. Vertex AI

The same Gemini models are reachable through two front doors. Knowing which door fits which situation is a guaranteed exam theme.

- **Google AI Studio** (also called Google AI / AI Studio) is the **fast, consumer- and developer-friendly** way in. You sign in, get an **API key**, and start prototyping in minutes. It is ideal for individuals, learning, quick experiments, and proof-of-concept apps.
- **Vertex AI** is Google Cloud's **enterprise, fully-managed AI/ML platform**. Same models, but wrapped in **security, governance, IAM access controls, data residency, MLOps, monitoring, and scalability**. It is where organizations run production workloads.

| | **Google AI Studio** | **Vertex AI** |
| --- | --- | --- |
| Audience | Individual developers, prototypers | Enterprises, teams, production |
| Access | Simple API key | Google Cloud project + IAM |
| Strengths | Speed, simplicity, free/low-cost start | Security, governance, data residency, MLOps |
| Use it when | Testing an idea quickly | Deploying at scale with enterprise controls |

**Exam shortcut:** words like *prototype, quick, API key, individual developer* point to **Google AI Studio**. Words like *enterprise, governance, compliance, data residency, production, security controls* point to **Vertex AI**.

## The Vertex AI platform

Vertex AI is a **unified platform** that covers the full lifecycle of building with AI. Its key components:

- **Vertex AI Studio** — a workspace to **prompt, test, tune, and evaluate** models before you ship them.
- **Model Garden** — a **catalog/library of 100+ models** you can discover, test, and deploy (detailed below).
- **Model tuning** — adapt a base model to your data and tone.
- **Pipelines & MLOps** — automate, monitor, and manage models in production.
- **Evaluation** — measure model quality against your criteria.
- **Grounding** — connect models to your data or to Google Search for factual answers.
- **Prediction / endpoints** — deploy a model and serve it at scale.

### Model Garden

**Model Garden** is Vertex AI's front-of-catalog. It lets you browse, compare, test, and deploy models from three sources:

- **Google first-party models** — **Gemini**, **Imagen**, **Veo**, **Chirp**, **Lyria**.
- **Open models** — **Gemma** (Google's open, lightweight models), plus others.
- **Third-party / partner models** — Anthropic's **Claude**, Meta's **Llama**, and more.

The takeaway for the exam: **Model Garden is where you go to discover and choose among many models — Google's, open, and partner — all in one managed place.**

## Generative media models

Beyond text, Google offers specialized first-party models for creating media. Know what each one **generates**:

- **Imagen** — generates and edits **images** from text prompts.
- **Veo** — generates **video** from text or images.
- **Chirp** — **speech/audio**: speech-to-text and text-to-speech (voice).
- **Lyria** — generates **music**.
- **Gemma** — a family of **open, lightweight models** you can download and run yourself (including on your own infrastructure). Not a media model, but often grouped here because it is Google-built and open.

A quick memory hook: **Imag**en = images, **V**eo = video, **Chirp** = a bird "chirps" = audio/speech, **Lyria** = "lyric" = music.

## Agents, Agent Builder, and search

An **agent** is an AI system that can **understand a goal, reason about steps, use tools or data, and take actions** to complete a task — not just answer a single prompt. Think of it as software that can act on your behalf.

- **Vertex AI Agent Builder** — the toolkit to **build AI agents and search/conversational apps** grounded in your own data, often with little custom code.
- **Vertex AI Search** — **enterprise search and grounding/retrieval over your own data**. This is Google's managed **RAG (retrieval-augmented generation)** capability: it finds relevant information in your documents and feeds it to the model so answers are based on *your* content.
- **Google Agentspace** — brings **enterprise search + AI agents to employees**, so staff can find information and get work done across company systems from one place.

**Exam mapping:** *"search our internal documents in natural language"* → **Vertex AI Search**. *"build a custom customer-service agent"* → **Agent Builder**. *"give all employees an AI assistant over company knowledge and apps"* → **Agentspace**.

## Grounding with Google Search

Foundation models have a **knowledge cutoff** and can **hallucinate**. **Grounding with Google Search** connects Gemini to **fresh, real-world web results**, so responses are anchored to current, verifiable information and hallucinations drop. Grounding can point at **Google Search** (for public, up-to-date facts) or at **your own data** via Vertex AI Search (for private, company-specific facts).

## Gemini for Workspace and for Google Cloud

Google embeds Gemini directly into the tools people already use:

- **Gemini for Google Workspace** — AI inside **Docs, Gmail, Sheets, Slides, and Meet**: drafting emails and documents, summarizing threads, generating tables and slides, and taking meeting notes. Aimed at everyday knowledge workers.
- **Gemini for Google Cloud** — AI assistance for technical users, including **Gemini Code Assist** (help writing, explaining, and reviewing code) and **Cloud Assist** (help designing, operating, and troubleshooting cloud environments).

**Exam mapping:** *"help employees write and summarize in email/docs"* → **Gemini for Workspace**. *"help developers write code"* → **Gemini Code Assist**.

## NotebookLM & NotebookLM Enterprise

**NotebookLM** is a **grounded research and note-taking assistant**. Its defining trait: it answers **only from the sources you upload** — your documents, PDFs, notes — and cites them, rather than pulling from the open web. That makes its answers trustworthy and traceable, which is exactly what the exam tests. Features include **Audio Overviews** (a podcast-style spoken summary of your sources).

**NotebookLM Enterprise** is the version with Google Cloud's **enterprise security, privacy, and compliance controls** for organizational use.

**Exam trigger:** *"answers strictly from uploaded documents,"* *"grounded in my own sources,"* *"cited,"* *"research assistant over my files"* → **NotebookLM**.

## AI infrastructure

Underneath every model is the hardware and architecture that trains and serves it:

- **TPUs (Tensor Processing Units)** — Google's **custom-designed AI accelerator chips (ASICs)** built specifically for machine learning, e.g. the **Trillium** generation. Highly efficient for large-scale training and inference.
- **GPUs** — general-purpose accelerators (e.g. **NVIDIA**) also available on Google Cloud for AI workloads.
- **AI Hypercomputer** — Google's **integrated supercomputing architecture** that combines optimized hardware (TPUs/GPUs), software, and networking into one system for training and serving large models at scale.

**Exam note:** TPUs are *Google's own* AI chips; GPUs are the *other* accelerator option; **AI Hypercomputer** is the whole *integrated system*, not a single chip.

## A note on security

**SAIF (Secure AI Framework)** is Google's framework for **securing AI systems** end to end — a conceptual best-practice framework you may see referenced when the topic is trustworthy, secure AI.

## Where each product fits a business need

- Prototype an idea fast, no cloud setup → **Google AI Studio**
- Run gen AI in production with governance → **Vertex AI**
- Discover and compare many models → **Model Garden**
- Generate images / video / voice / music → **Imagen / Veo / Chirp / Lyria**
- Run an open model yourself → **Gemma**
- Search internal data / add RAG → **Vertex AI Search**
- Build a custom agent → **Agent Builder**; give it to all staff → **Agentspace**
- Reduce hallucination with live facts → **Grounding with Google Search**
- AI in email and docs → **Gemini for Workspace**; AI for coding → **Gemini Code Assist**
- Research assistant grounded only in my files → **NotebookLM**
- The chips and system that power it all → **TPUs / GPUs / AI Hypercomputer**

## Key terms

- **Gemini** — Google's family of natively multimodal foundation models (Pro, Flash, and more).
- **Gemini Pro / Flash** — Pro = most capable; Flash = fast and low-cost.
- **Google AI Studio** — quick, API-key access to Gemini for prototyping.
- **Vertex AI** — Google Cloud's enterprise, fully-managed AI/ML platform.
- **Vertex AI Studio** — workspace to prompt, tune, test, and evaluate models.
- **Model Garden** — catalog of 100+ first-party, open, and third-party models.
- **Gemma** — Google's open, lightweight models you can run yourself.
- **Imagen / Veo / Chirp / Lyria** — image / video / speech / music generation.
- **Vertex AI Agent Builder** — build agents and search/conversational apps.
- **Vertex AI Search** — enterprise search, grounding, and RAG over your data.
- **Google Agentspace** — enterprise search plus agents for employees.
- **Grounding with Google Search** — connect Gemini to fresh web results.
- **Gemini for Workspace** — AI in Docs, Gmail, Sheets, Slides, Meet.
- **Gemini Code Assist / Cloud Assist** — AI for developers and cloud ops.
- **NotebookLM** — research assistant grounded only in your uploaded sources.
- **TPU** — Google's custom AI accelerator chip (ASIC).
- **AI Hypercomputer** — Google's integrated AI supercomputing architecture.
- **SAIF** — Google's Secure AI Framework.

## Exam tips

> **Consumer vs. enterprise is the recurring theme.** API key + prototyping = **Google AI Studio**; security, governance, data residency, production = **Vertex AI**. They serve the *same* Gemini models.

> **Match the media to the model.** Images → **Imagen**, video → **Veo**, speech/audio → **Chirp**, music → **Lyria**. **Gemma** = open models you run yourself.

> **NotebookLM answers ONLY from your uploaded sources** and cites them. If a question stresses "grounded in my own documents," that is NotebookLM — not general Gemini.

> **Model Garden is the catalog.** If a scenario is about *discovering, comparing, or deploying many models* — including Claude or Llama alongside Gemini — the answer is Model Garden.

> **Know the agent trio:** **Vertex AI Search** (search/RAG over your data), **Agent Builder** (build agents), **Agentspace** (search + agents for employees).

> **Infrastructure:** **TPUs** are Google's own AI chips (ASICs); **GPUs** are the alternative accelerator; **AI Hypercomputer** is the integrated system that ties hardware, software, and networking together.

> **Grounding fights hallucination and knowledge cutoff** by connecting the model to fresh Google Search results or to your own data.
