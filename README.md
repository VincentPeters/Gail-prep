# GAIL Prep — Google Cloud Generative AI Leader study companion

A free, static learning site to help you pass the **Google Cloud Generative AI Leader (GAIL)** certification. Built with [Astro](https://astro.build/) and deployed to GitHub Pages.

> Unofficial and not affiliated with or endorsed by Google. Always confirm exam details on the [official certification page](https://cloud.google.com/learn/certification/generative-ai-leader).

## What's inside

- **📚 Study notes** — plain-language notes for all four exam domains, written for a non-technical / business audience, each ending with a glossary and exam tips.
- **✅ Domain quizzes** — practice questions with instant feedback and an explanation for every answer.
- **⏱️ Timed mock exam** — a full 50-question / 90-minute exam, sampled to match the official domain weighting, with a scored per-domain review.
- **🃏 Flashcards** — terminology and Google Cloud product recall, with "known / still learning" tracking.
- **📊 Progress dashboard** — accuracy by domain, exam history, and flashcard mastery, all stored locally in your browser (no backend, no account).

## The exam at a glance

| | |
|---|---|
| Format | 50–60 multiple-choice questions |
| Duration | 90 minutes |
| Cost | $99 USD (+ tax) |
| Delivery | Online- or onsite-proctored |
| Validity | 3 years |
| Prerequisites | None |
| Audience | Business & non-technical professionals |

**Exam domains (official weightings):**

1. Fundamentals of Generative AI — ~30%
2. Google Cloud's Generative AI Offerings — ~35%
3. Techniques to Improve Gen AI Model Output — ~20%
4. Business Strategies for a Successful Gen AI Solution — ~15%

## Develop locally

```bash
npm install
npm run dev      # http://localhost:4321/Gail-prep
npm run build    # static output in dist/
npm run preview  # preview the production build
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow in
`.github/workflows/deploy.yml`, which builds the site and publishes it to
GitHub Pages. In the repo settings, set **Pages → Build and deployment →
Source** to **GitHub Actions**. The site is served under the `/Gail-prep`
base path (configured in `astro.config.mjs`).

## Adding or editing content

Content is data-driven and drop-in — no code changes needed:

- **Study notes:** Markdown files in `src/content/study/` (frontmatter: `title`, `domain`, `order`, `summary`, `readingMinutes`).
- **Questions:** JSON arrays in `src/data/questions/*.json`.
- **Flashcards:** JSON arrays in `src/data/flashcards/*.json`.

Domain metadata and exam facts live in `src/data/domains.ts`. Every JSON file in
those folders is picked up automatically.

### Question schema

```json
{
  "id": "fund-01",
  "domain": "fundamentals",
  "difficulty": "easy | medium | hard",
  "question": "…",
  "options": ["A", "B", "C", "D"],
  "answer": 0,
  "explanation": "why the correct answer is right",
  "topic": "short label"
}
```

`answer` is the 0-based index of the correct option.

## Project structure

```
src/
  components/   Quiz, ExamRunner, FlashcardDeck, ProgressDashboard (Astro islands)
  content/      study notes (Astro content collection)
  data/         domains.ts, question & flashcard JSON, data loader
  layouts/      BaseLayout.astro
  pages/        home, study, quizzes, exam, flashcards, progress
  scripts/      client-side engines (quiz, exam, flashcards, progress, storage)
  styles/       global + widget CSS
```
