/**
 * Practice quiz engine — one question at a time, instant feedback,
 * explanation after each answer, and a summary at the end.
 * Frameworkless: reads embedded JSON and drives the DOM directly.
 */
import type { Question } from "../data/types";
import { recordAnswer } from "./storage";

function esc(s: string): string {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Prepared {
  q: Question;
  options: { text: string; correct: boolean }[];
}

function prepare(q: Question, shuffleOpts: boolean): Prepared {
  const opts = q.options.map((text, i) => ({ text, correct: i === q.answer }));
  return { q, options: shuffleOpts ? shuffle(opts) : opts };
}

class Quiz {
  private root: HTMLElement;
  private mount: HTMLElement;
  private questions: Prepared[];
  private idx = 0;
  private answered = 0;
  private correct = 0;
  private missed: Prepared[] = [];
  private locked = false;

  constructor(root: HTMLElement, questions: Question[]) {
    this.root = root;
    this.mount = root.querySelector(".quiz-mount") as HTMLElement;
    const shuffleQ = root.dataset.shuffle !== "false";
    const shuffleO = root.dataset.shuffleOptions !== "false";
    let list = shuffleQ ? shuffle(questions) : questions.slice();
    const limit = Number(root.dataset.limit || 0);
    if (limit > 0) list = list.slice(0, limit);
    this.questions = list.map((q) => prepare(q, shuffleO));
    this.render();
  }

  private render(): void {
    if (this.idx >= this.questions.length) return this.renderSummary();
    const { q, options } = this.questions[this.idx];
    const n = this.idx + 1;
    const total = this.questions.length;
    this.locked = false;

    this.mount.innerHTML = `
      <div class="quiz-head">
        <span class="pill dot d-${q.domain}">Q${n} / ${total}</span>
        <span class="pill">${esc(q.difficulty)}</span>
      </div>
      <div class="bar quiz-progress"><span style="width:${((n - 1) / total) * 100}%"></span></div>
      <p class="quiz-question">${esc(q.question)}</p>
      <div class="quiz-options" role="listbox" aria-label="Answer options">
        ${options
          .map(
            (o, i) => `
          <button class="quiz-option" data-i="${i}" data-correct="${o.correct}">
            <span class="quiz-key">${String.fromCharCode(65 + i)}</span>
            <span class="quiz-opt-text">${esc(o.text)}</span>
          </button>`,
          )
          .join("")}
      </div>
      <div class="quiz-feedback" hidden></div>
      <div class="quiz-actions">
        <span class="quiz-tally">Score: ${this.correct}/${this.answered}</span>
        <button class="btn btn-primary quiz-next" hidden>Next →</button>
      </div>
    `;

    const optionEls = this.mount.querySelectorAll<HTMLButtonElement>(".quiz-option");
    optionEls.forEach((el) =>
      el.addEventListener("click", () => this.choose(el)),
    );
    const next = this.mount.querySelector<HTMLButtonElement>(".quiz-next");
    next?.addEventListener("click", () => {
      this.idx++;
      this.render();
    });
  }

  private choose(el: HTMLButtonElement): void {
    if (this.locked) return;
    this.locked = true;
    const prepared = this.questions[this.idx];
    const isCorrect = el.dataset.correct === "true";
    this.answered++;
    if (isCorrect) this.correct++;
    else this.missed.push(prepared);
    recordAnswer(prepared.q.id, prepared.q.domain, isCorrect);

    const optionEls = this.mount.querySelectorAll<HTMLButtonElement>(".quiz-option");
    optionEls.forEach((o) => {
      o.disabled = true;
      if (o.dataset.correct === "true") o.classList.add("is-correct");
    });
    if (!isCorrect) el.classList.add("is-incorrect");

    const fb = this.mount.querySelector<HTMLElement>(".quiz-feedback");
    if (fb) {
      fb.hidden = false;
      fb.className = `quiz-feedback ${isCorrect ? "ok" : "no"}`;
      fb.innerHTML = `
        <strong>${isCorrect ? "✓ Correct" : "✗ Not quite"}</strong>
        <p>${esc(prepared.q.explanation)}</p>
        ${prepared.q.topic ? `<span class="pill">${esc(prepared.q.topic)}</span>` : ""}
      `;
    }
    const tally = this.mount.querySelector<HTMLElement>(".quiz-tally");
    if (tally) tally.textContent = `Score: ${this.correct}/${this.answered}`;
    const next = this.mount.querySelector<HTMLButtonElement>(".quiz-next");
    if (next) {
      next.hidden = false;
      next.textContent =
        this.idx + 1 >= this.questions.length ? "See results →" : "Next →";
      next.focus();
    }
  }

  private renderSummary(): void {
    const total = this.questions.length;
    const pct = total ? Math.round((this.correct / total) * 100) : 0;
    const verdict =
      pct >= 80 ? "Excellent" : pct >= 70 ? "On track" : "Keep studying";
    this.mount.innerHTML = `
      <div class="quiz-summary">
        <div class="score-ring" style="--pct:${pct}">
          <span>${pct}%</span>
        </div>
        <h3>${verdict}</h3>
        <p>You answered <strong>${this.correct}</strong> of <strong>${total}</strong> correctly.</p>
        ${
          this.missed.length
            ? `<div class="quiz-review">
                 <h4>Review what you missed</h4>
                 ${this.missed
                   .map(
                     (m) => `
                   <details class="review-item">
                     <summary>${esc(m.q.question)}</summary>
                     <p><strong>Correct answer:</strong> ${esc(m.q.options[m.q.answer])}</p>
                     <p>${esc(m.q.explanation)}</p>
                   </details>`,
                   )
                   .join("")}
               </div>`
            : `<p class="quiz-perfect">Nothing missed — nice work. 🎉</p>`
        }
        <button class="btn btn-primary quiz-restart">Restart quiz</button>
      </div>
    `;
    this.mount
      .querySelector(".quiz-restart")
      ?.addEventListener("click", () => {
        this.idx = 0;
        this.answered = 0;
        this.correct = 0;
        this.missed = [];
        this.questions = shuffle(this.questions);
        this.render();
      });
  }
}

export function initQuizzes(): void {
  document.querySelectorAll<HTMLElement>("[data-quiz]").forEach((root) => {
    const script = root.querySelector<HTMLScriptElement>(
      'script[type="application/json"]',
    );
    if (!script) return;
    try {
      const questions = JSON.parse(script.textContent || "[]") as Question[];
      if (questions.length) new Quiz(root, questions);
    } catch (e) {
      console.error("Failed to init quiz", e);
    }
  });
}
