// Shared metadata for the four official GAIL exam domains.
// Weights come from the official exam guide (Google Cloud, 2025).

export interface Domain {
  id: string;
  slug: string;
  title: string;
  short: string;
  weight: number; // percent of the exam
  color: string; // css var name suffix, matches .d-* helpers
  hex: string;
  blurb: string;
  topics: string[];
}

export const DOMAINS: Domain[] = [
  {
    id: "fundamentals",
    slug: "fundamentals-of-gen-ai",
    title: "Fundamentals of Generative AI",
    short: "Fundamentals",
    weight: 30,
    color: "fundamentals",
    hex: "#4285f4",
    blurb:
      "What generative AI is, how foundation models and LLMs work, key terminology, data's role, and how gen AI differs from traditional ML.",
    topics: [
      "AI vs. ML vs. deep learning vs. gen AI",
      "Foundation models & LLMs",
      "Tokens, parameters, embeddings",
      "Training, inference & the transformer",
      "Multimodal models",
      "Data quality, types & the ML lifecycle",
      "Limitations: hallucinations, bias, knowledge cutoff",
    ],
  },
  {
    id: "offerings",
    slug: "google-cloud-gen-ai-offerings",
    title: "Google Cloud's Generative AI Offerings",
    short: "GC Offerings",
    weight: 35,
    color: "offerings",
    hex: "#34a853",
    blurb:
      "Google's gen AI stack: Gemini models, Vertex AI, Model Garden, Agent Builder, Gemini for Workspace, NotebookLM, and the infrastructure beneath it.",
    topics: [
      "Gemini model family & Google AI vs. Vertex AI",
      "Vertex AI platform & Model Garden",
      "Vertex AI Agent Builder & agents",
      "Gemini for Google Workspace & Google Cloud",
      "NotebookLM & NotebookLM Enterprise",
      "Grounding, Search & Vertex AI Search",
      "AI infrastructure: TPUs, GPUs, Hypercomputer",
    ],
  },
  {
    id: "techniques",
    slug: "techniques-to-improve-output",
    title: "Techniques to Improve Gen AI Model Output",
    short: "Techniques",
    weight: 20,
    color: "techniques",
    hex: "#a142f4",
    blurb:
      "Prompt engineering, grounding and RAG, model tuning, and how to choose the right approach to make model output accurate and useful.",
    topics: [
      "Prompt engineering & prompt components",
      "Zero-/one-/few-shot prompting",
      "Grounding & retrieval-augmented generation (RAG)",
      "Fine-tuning vs. prompt design vs. RAG",
      "Model selection trade-offs (cost, latency, quality)",
      "Temperature, tokens & sampling controls",
      "Evaluating and iterating on output",
    ],
  },
  {
    id: "business",
    slug: "business-strategies",
    title: "Business Strategies for a Successful Gen AI Solution",
    short: "Business",
    weight: 15,
    color: "business",
    hex: "#f9ab00",
    blurb:
      "Turning gen AI into business value: use cases, ROI, responsible AI, security, governance, and building an AI-ready organization.",
    topics: [
      "Identifying high-value use cases",
      "Measuring value, ROI & KPIs",
      "Responsible AI: Google's AI Principles",
      "Fairness, transparency, explainability & safety",
      "Security, privacy & data governance",
      "Change management & AI adoption",
      "Human-in-the-loop & risk management",
    ],
  },
];

export const DOMAIN_BY_ID = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<string, Domain>;

export const EXAM_FACTS = {
  questions: "50–60 multiple-choice",
  duration: "90 minutes",
  cost: "$99 USD (+ tax)",
  delivery: "Online- or onsite-proctored",
  validity: "3 years",
  prerequisites: "None",
  audience: "Business & non-technical professionals",
  launched: "May 2025",
  // Google does not publish an official passing score; ~70% is a common
  // community estimate used here only to set a practice target.
  practiceTarget: 70,
  mockExamQuestions: 50,
  mockExamMinutes: 90,
};
