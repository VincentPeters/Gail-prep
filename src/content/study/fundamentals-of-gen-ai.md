---
title: "Fundamentals of Generative AI"
domain: "fundamentals"
order: 1
summary: "What generative AI is, how large language and foundation models work, the vocabulary the exam expects, and the limitations every AI leader must understand."
readingMinutes: 14
---

Generative AI is the headline technology behind tools like Gemini, and Domain 1 of the exam is where you build the mental model everything else rests on. You do not need to write code or do math. You do need to speak the language fluently, explain *how* these systems work at a high level, and know where they break. This chapter gives you exactly that.

## From AI to Generative AI: the nested picture

One of the most common exam framings is the relationship between four terms that people often use interchangeably. They are not the same thing — they nest inside one another like Russian dolls.

- **Artificial Intelligence (AI)** is the broadest field: any technique that lets machines mimic human intelligence, from rule-based systems to modern neural networks.
- **Machine Learning (ML)** is a subset of AI where systems *learn patterns from data* rather than being explicitly programmed with rules.
- **Deep Learning** is a subset of ML that uses **neural networks** with many layers ("deep") to learn complex patterns. It powers most modern breakthroughs.
- **Generative AI** is a subset of deep learning focused on *creating new content* — text, images, audio, video, or code — that resembles its training data.

> Remember the direction: **AI ⊃ ML ⊃ Deep Learning ⊃ Generative AI.** Generative AI is the smallest, most specialized doll inside the set.

### Types of machine learning

The exam expects you to distinguish three learning styles in plain language:

- **Supervised learning** — the model learns from **labeled** data (inputs paired with correct answers). Example: emails tagged "spam" or "not spam." Good for prediction and classification.
- **Unsupervised learning** — the model finds structure in **unlabeled** data on its own, such as grouping (clustering) customers by behavior without being told the groups in advance.
- **Reinforcement learning** — the model learns by **trial and error**, receiving rewards or penalties for its actions. Think of an agent learning to play a game, or fine-tuning a chatbot to be more helpful using human feedback.

## Predictive AI vs. Generative AI

This distinction is a favorite exam trap. Both are AI, but they produce fundamentally different things.

| Aspect | Predictive / Discriminative AI | Generative AI |
| --- | --- | --- |
| Core job | Classifies, predicts, or scores existing data | Creates brand-new content |
| Typical output | A label, number, or category ("fraud" / "not fraud", a price) | Text, images, audio, video, or code |
| Question it answers | "Which class does this belong to?" | "What new example could exist?" |
| Example | Predicting whether a loan will default | Writing a loan summary email or drafting an image |
| Learns | The boundary *between* categories | The underlying distribution of the data itself |

The short version: **predictive AI tells you what something *is*; generative AI makes something *new*.**

## Foundation models and large language models

Modern generative AI is built on **foundation models**: very large models **pre-trained** on massive, broad datasets so they can be **adapted** to many different tasks. Because they are general-purpose, one foundation model can be reused for summarizing, translating, coding, answering questions, and more — instead of building a separate narrow model for each task.

A **Large Language Model (LLM)** is a foundation model specialized for language. LLMs are:

- **Pre-trained** on enormous amounts of text (books, websites, code).
- **General-purpose** — one model handles many language tasks.
- **Adaptable** — they can be tuned or prompted for specific needs.

### How LLMs work at a high level

You will not be asked for math, but you should be able to explain the mechanics conceptually.

- **Tokens** — LLMs do not read words directly. They break text into **tokens** (words or word pieces). A token is roughly ¾ of a word in English.
- **The transformer architecture** — the breakthrough design (introduced in 2017) behind modern LLMs. Its key innovation is **self-attention**, which lets the model weigh how much each token relates to every other token in the input. That is how it understands that "it" refers to "the dog" earlier in a sentence, and how it keeps context across long passages.
- **Predicting the next token** — at its core, an LLM generates text by repeatedly predicting the **most likely next token** given everything before it. String those predictions together and you get fluent sentences. This is why LLMs are sometimes described as very sophisticated autocomplete.
- **Parameters** — the internal values (weights) the model learns during training. Larger models have billions of parameters; more parameters generally mean more capacity to capture patterns, but also more cost to run.

### Embeddings and vectors

Computers work with numbers, not words. **Embeddings** turn words, sentences, images, or other data into **vectors** — lists of numbers that capture *meaning*. Items with similar meaning end up close together in this numeric space.

- "King" and "queen" land near each other; "banana" lands far away.
- This **semantic similarity** is what powers search, recommendations, and retrieval systems that find *relevant* content even when the exact words differ.

Embeddings are foundational to many enterprise AI patterns, so expect the exam to test whether you know they represent **meaning as numbers**, not just a translation of letters.

## Training, inference, and tuning

Three timing-related terms are frequently confused:

- **Training** — the compute-heavy process of teaching the model by adjusting its parameters over huge datasets.
- **Inference** — using the already-trained model to generate an output for a new input. Every time you send a prompt and get a response, that is inference.
- **Pre-training vs. fine-tuning** — **pre-training** is the initial, broad, expensive learning phase on general data. **Fine-tuning** takes that pre-trained model and further trains it on a smaller, specialized dataset (e.g., your company's support tickets) to specialize its behavior.
- **Context window** — the maximum amount of text (measured in tokens) the model can consider at once, including both your prompt and its response. Exceed it and the model "forgets" the earliest content. A larger context window lets the model work with more information in a single request.

## Multimodal models and image generation

Early LLMs handled only text. **Multimodal models** can accept and/or produce **multiple types of data** — text, images, audio, video, and code — often in combination. You might show a multimodal model a photo and ask a question about it, or describe a scene and have it generate an image. Gemini is designed to be natively multimodal.

For images specifically, **diffusion models** are the dominant approach. They learn to generate an image by starting from random **noise** and gradually **removing** it, step by step, until a coherent picture matching the prompt emerges. It helps to think of it as sculpting an image out of static.

## The critical role of data

Generative AI is only as good as the data behind it. The exam repeatedly stresses data quality.

- **Quality and quantity both matter** — models need large volumes of data, but noisy or biased data produces noisy or biased outputs. This is the classic **"garbage in, garbage out"** principle.
- **Structured vs. unstructured** — structured data lives in neat rows and columns (databases, spreadsheets); unstructured data is free-form (emails, images, PDFs, audio). Most of the world's data — and most of what LLMs train on — is **unstructured**.
- **Labeled vs. unlabeled** — labeled data has answers attached (needed for supervised learning); unlabeled data does not. Labeling is often expensive and time-consuming, which is one reason approaches that use unlabeled data are valuable.

## Limitations and risks every AI leader must know

Knowing where generative AI fails is as important as knowing what it can do. This is heavily tested.

- **Hallucinations** — the model produces confident, fluent output that is **factually wrong or fabricated**. Because it predicts plausible tokens, it can invent citations, statistics, or events. Always verify high-stakes output.
- **Bias** — models can reflect and amplify **biases** present in their training data, leading to unfair or skewed outputs.
- **Knowledge cutoff / staleness** — a model only knows what was in its training data up to a certain date. Ask about events after its **knowledge cutoff** and it cannot answer accurately without external tools.
- **Non-determinism** — the same prompt can produce **different answers** on different runs, because generation involves probability. This makes outputs harder to test and reproduce.
- **Cost and compute** — training and running large models consumes significant **computing power, energy, and money**. Bigger is not always better for a given business need.
- **Lack of true reasoning** — despite fluent responses, LLMs do not "understand" or reason like humans. They are **pattern-matching** over statistics, which is why they can fail at simple logic or arithmetic while sounding authoritative.

## Key terms

- **Artificial Intelligence (AI)** — the broad field of making machines mimic human intelligence.
- **Machine Learning (ML)** — a subset of AI where systems learn patterns from data instead of explicit rules.
- **Deep Learning** — ML using multi-layered neural networks to learn complex patterns.
- **Generative AI** — AI that creates new content (text, image, audio, video, code).
- **Predictive/Discriminative AI** — AI that classifies or predicts based on existing data rather than creating new content.
- **Foundation model** — a large model pre-trained on broad data and adaptable to many downstream tasks.
- **Large Language Model (LLM)** — a foundation model specialized for language.
- **Token** — a unit of text (word or word-piece) that a model processes.
- **Parameter** — an internal learned weight; models have millions to billions.
- **Transformer** — the neural network architecture behind modern LLMs.
- **Self-attention** — the mechanism that weighs how tokens relate to one another for context.
- **Embedding / vector** — a numeric representation of data that captures meaning and enables semantic similarity.
- **Training** — teaching the model by adjusting parameters on data.
- **Inference** — using a trained model to generate output for a new input.
- **Fine-tuning** — further training a pre-trained model on a specialized dataset.
- **Context window** — the maximum tokens a model can consider at once.
- **Multimodal** — able to handle multiple data types (text, image, audio, video, code).
- **Diffusion model** — image-generation approach that removes noise step by step.
- **Hallucination** — confident but factually wrong or fabricated output.
- **Knowledge cutoff** — the date after which a model has no training knowledge.

## Exam tips

> **Nesting order matters.** Expect a question that tests AI ⊃ ML ⊃ Deep Learning ⊃ Generative AI. Generative AI is the *most specific* term, not the broadest.

> **Predictive vs. generative** is a classic trap: predictive/discriminative AI *classifies or predicts*, generative AI *creates new content*. Match the verb to the category.

> **Foundation model = general-purpose and adaptable.** If an answer stresses "pre-trained on broad data, reusable for many tasks," it is describing a foundation model.

> **LLMs predict the next token** and rely on the **transformer's self-attention** for context. No answer choice should claim they "understand" or "reason" like a human.

> **Hallucinations, bias, and knowledge cutoff** are the three limitations most likely to appear. When a scenario involves fabricated facts, pick hallucination; outdated info, pick knowledge cutoff.

> **"Garbage in, garbage out."** Any scenario about poor results usually traces back to data quality — that is almost always the intended answer.
