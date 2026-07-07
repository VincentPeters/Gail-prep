/**
 * Timed mock-exam engine.
 * Samples questions weighted by the official domain blueprint, runs a
 * 90-minute countdown, supports navigation + flagging, then scores with a
 * per-domain breakdown and stores the attempt.
 */
import type { Question } from "../data/types";
import { DOMAINS, EXAM_FACTS } from "../data/domains";
import { recordAnswer, recordExam, type ExamResult } from "./storage";

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

/** Distribute `total` questions across domains proportional to exam weights. */
function sampleByBlueprint(pool: Question[], total: number): Question[] {
  const byDomain: Record<string, Question[]> = {};
  for (const q of pool) (byDomain[q.domain] ||= []).push(q);

  const picks: Question[] = [];
  let allocated = 0;
  const weightSum = DOMAINS.reduce((s, d) => s + d.weight, 0);
  DOMAINS.forEach((d, i) => {
    const isLast = i === DOMAINS.length - 1;
    let n = isLast
      ? total - allocated
      : Math.round((d.weight / weightSum) * total);
    const available = byDomain[d.id] || [];
    n = Math.min(n, available.length);
    allocated += n;
    picks.push(...shuffle(available).slice(0, n));
  });
  // Top up if some domain ran short of questions.
  if (picks.length < total) {
    const chosen = new Set(picks.map((q) => q.id));
    const rest = shuffle(pool.filter((q) => !chosen.has(q.id)));
    picks.push(...rest.slice(0, total - picks.length));
  }
  return shuffle(picks);
}

interface ExamOption {
  text: string;
  correct: boolean;
}

class Exam {
  private mount: HTMLElement;
  private pool: Question[];
  private questions: { q: Question; options: ExamOption[] }[] = [];
  private answers: (number | null)[] = [];
  private flags: boolean[] = [];
  private idx = 0;
  private total: number;
  private endsAt = 0;
  private timer: number | null = null;
  private submitted = false;

  constructor(root: HTMLElement, pool: Question[]) {
    this.mount = root.querySelector(".exam-mount") as HTMLElement;
    this.pool = pool;
    this.total = Number(root.dataset.count || EXAM_FACTS.mockExamQuestions);
    this.renderStart();
  }

  private renderStart(): void {
    const minutes = EXAM_FACTS.mockExamMinutes;
    this.mount.innerHTML = `
      <div class="exam-start card card-pad">
        <h2>Full Mock Exam</h2>
        <p>${this.total} questions · ${minutes} minutes · weighted like the real blueprint.
        No feedback until you submit — just like exam day.</p>
        <ul class="exam-facts">
          <li><strong>${EXAM_FACTS.questions}</strong> on the real exam</li>
          <li><strong>${EXAM_FACTS.duration}</strong> real duration</li>
          <li>Target to pass here: <strong>${EXAM_FACTS.practiceTarget}%</strong> (Google doesn't publish the official cut score)</li>
        </ul>
        <button class="btn btn-primary exam-begin">Start the ${minutes}-minute exam</button>
      </div>
    `;
    this.mount
      .querySelector(".exam-begin")
      ?.addEventListener("click", () => this.begin());
  }

  private begin(): void {
    const picked = sampleByBlueprint(this.pool, this.total);
    this.questions = picked.map((q) => ({
      q,
      options: shuffle(
        q.options.map((text, i) => ({ text, correct: i === q.answer })),
      ),
    }));
    this.answers = new Array(this.questions.length).fill(null);
    this.flags = new Array(this.questions.length).fill(false);
    this.idx = 0;
    this.submitted = false;
    this.endsAt = Date.now() + EXAM_FACTS.mockExamMinutes * 60 * 1000;
    this.startTimer();
    this.renderExam();
  }

  private updateTimer(): void {
    const remaining = Math.max(0, this.endsAt - Date.now());
    const el = this.mount.querySelector<HTMLElement>(".exam-timer");
    if (el) {
      const s = Math.floor(remaining / 1000);
      const m = Math.floor(s / 60);
      el.textContent = `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
      el.classList.toggle("urgent", remaining < 5 * 60 * 1000);
    }
    if (remaining <= 0 && !this.submitted) this.submit();
  }

  private startTimer(): void {
    if (this.timer) window.clearInterval(this.timer);
    this.updateTimer();
    this.timer = window.setInterval(() => this.updateTimer(), 1000);
  }

  private renderExam(): void {
    const { q, options } = this.questions[this.idx];
    const n = this.idx + 1;
    this.mount.innerHTML = `
      <div class="exam-bar">
        <span class="pill dot d-${q.domain}">Question ${n} / ${this.questions.length}</span>
        <div class="exam-timer-wrap">⏱ <span class="exam-timer">--:--</span></div>
      </div>
      <div class="exam-body">
        <div class="exam-q card card-pad">
          <p class="quiz-question">${esc(q.question)}</p>
          <div class="quiz-options">
            ${options
              .map(
                (o, i) => `
              <button class="quiz-option ${this.answers[this.idx] === i ? "selected" : ""}" data-i="${i}">
                <span class="quiz-key">${String.fromCharCode(65 + i)}</span>
                <span class="quiz-opt-text">${esc(o.text)}</span>
              </button>`,
              )
              .join("")}
          </div>
          <div class="exam-controls">
            <button class="btn btn-ghost exam-prev" ${this.idx === 0 ? "disabled" : ""}>← Prev</button>
            <button class="btn btn-ghost exam-flag">${this.flags[this.idx] ? "★ Flagged" : "☆ Flag"}</button>
            <button class="btn btn-primary exam-next">${this.idx + 1 === this.questions.length ? "Review →" : "Next →"}</button>
          </div>
        </div>
        <aside class="exam-palette card card-pad">
          <div class="exam-palette-head">
            <strong>Questions</strong>
            <button class="btn btn-primary exam-submit">Submit</button>
          </div>
          <div class="palette-grid">
            ${this.questions
              .map((_, i) => {
                const state = this.flags[i]
                  ? "flagged"
                  : this.answers[i] != null
                    ? "answered"
                    : "blank";
                return `<button class="palette-cell ${state} ${i === this.idx ? "current" : ""}" data-goto="${i}">${i + 1}</button>`;
              })
              .join("")}
          </div>
          <div class="palette-legend">
            <span><i class="sw answered"></i> Answered</span>
            <span><i class="sw flagged"></i> Flagged</span>
            <span><i class="sw blank"></i> Unanswered</span>
          </div>
        </aside>
      </div>
    `;
    this.updateTimer();
    this.bindExam();
  }

  private bindExam(): void {
    this.mount.querySelectorAll<HTMLButtonElement>(".quiz-option").forEach((el) =>
      el.addEventListener("click", () => {
        this.answers[this.idx] = Number(el.dataset.i);
        this.mount
          .querySelectorAll(".quiz-option")
          .forEach((o) => o.classList.remove("selected"));
        el.classList.add("selected");
        this.refreshPalette();
      }),
    );
    this.mount.querySelector(".exam-prev")?.addEventListener("click", () => {
      if (this.idx > 0) {
        this.idx--;
        this.renderExam();
      }
    });
    this.mount.querySelector(".exam-next")?.addEventListener("click", () => {
      if (this.idx + 1 < this.questions.length) {
        this.idx++;
        this.renderExam();
      } else {
        this.renderReview();
      }
    });
    this.mount.querySelector(".exam-flag")?.addEventListener("click", () => {
      this.flags[this.idx] = !this.flags[this.idx];
      this.renderExam();
    });
    this.mount.querySelectorAll<HTMLButtonElement>(".palette-cell").forEach((el) =>
      el.addEventListener("click", () => {
        this.idx = Number(el.dataset.goto);
        this.renderExam();
      }),
    );
    this.mount
      .querySelector(".exam-submit")
      ?.addEventListener("click", () => this.confirmSubmit());
  }

  private refreshPalette(): void {
    this.mount.querySelectorAll<HTMLButtonElement>(".palette-cell").forEach((el, i) => {
      const state = this.flags[i]
        ? "flagged"
        : this.answers[i] != null
          ? "answered"
          : "blank";
      el.className = `palette-cell ${state} ${i === this.idx ? "current" : ""}`;
    });
  }

  private renderReview(): void {
    const answered = this.answers.filter((a) => a != null).length;
    const flagged = this.flags.filter(Boolean).length;
    this.mount.innerHTML = `
      <div class="exam-bar">
        <span class="pill">Review before submitting</span>
        <div class="exam-timer-wrap">⏱ <span class="exam-timer">--:--</span></div>
      </div>
      <div class="card card-pad">
        <h2>Ready to submit?</h2>
        <p><strong>${answered}</strong> of <strong>${this.questions.length}</strong> answered · <strong>${flagged}</strong> flagged.</p>
        <div class="palette-grid">
          ${this.questions
            .map((_, i) => {
              const state = this.flags[i]
                ? "flagged"
                : this.answers[i] != null
                  ? "answered"
                  : "blank";
              return `<button class="palette-cell ${state}" data-goto="${i}">${i + 1}</button>`;
            })
            .join("")}
        </div>
        <div class="exam-controls">
          <button class="btn btn-ghost exam-back">← Back to questions</button>
          <button class="btn btn-primary exam-submit">Submit exam</button>
        </div>
      </div>
    `;
    this.updateTimer();
    this.mount.querySelectorAll<HTMLButtonElement>(".palette-cell").forEach((el) =>
      el.addEventListener("click", () => {
        this.idx = Number(el.dataset.goto);
        this.renderExam();
      }),
    );
    this.mount.querySelector(".exam-back")?.addEventListener("click", () => {
      this.renderExam();
    });
    this.mount
      .querySelector(".exam-submit")
      ?.addEventListener("click", () => this.confirmSubmit());
  }

  private confirmSubmit(): void {
    const unanswered = this.answers.filter((a) => a == null).length;
    const msg = unanswered
      ? `You have ${unanswered} unanswered question(s). Submit anyway?`
      : "Submit your exam for scoring?";
    if (window.confirm(msg)) this.submit();
  }

  private submit(): void {
    if (this.submitted) return;
    this.submitted = true;
    if (this.timer) window.clearInterval(this.timer);

    let correct = 0;
    const perDomain: Record<string, { correct: number; total: number }> = {};
    for (const d of DOMAINS) perDomain[d.id] = { correct: 0, total: 0 };

    this.questions.forEach((item, i) => {
      const chosen = this.answers[i];
      const isCorrect =
        chosen != null && item.options[chosen]?.correct === true;
      perDomain[item.q.domain].total++;
      if (isCorrect) {
        correct++;
        perDomain[item.q.domain].correct++;
      }
      recordAnswer(item.q.id, item.q.domain, isCorrect);
    });

    const total = this.questions.length;
    const score = Math.round((correct / total) * 100);
    const durationSec = Math.round(
      (EXAM_FACTS.mockExamMinutes * 60 * 1000 -
        Math.max(0, this.endsAt - Date.now())) /
        1000,
    );
    const passed = score >= EXAM_FACTS.practiceTarget;
    const result: ExamResult = {
      id: "exam-" + Date.now(),
      date: Date.now(),
      score,
      correct,
      total,
      durationSec,
      passed,
      perDomain,
    };
    recordExam(result);
    this.renderResults(result);
  }

  private renderResults(r: ExamResult): void {
    const mins = Math.floor(r.durationSec / 60);
    const secs = r.durationSec % 60;
    this.mount.innerHTML = `
      <div class="exam-results">
        <div class="card card-pad exam-scorecard ${r.passed ? "pass" : "fail"}">
          <div class="score-ring" style="--pct:${r.score}"><span>${r.score}%</span></div>
          <div>
            <h2>${r.passed ? "Pass 🎉" : "Not yet"}</h2>
            <p>${r.correct} / ${r.total} correct · finished in ${mins}m ${secs}s ·
            target ${EXAM_FACTS.practiceTarget}%</p>
          </div>
        </div>
        <h3>By domain</h3>
        <div class="domain-breakdown">
          ${DOMAINS.map((d) => {
            const pd = r.perDomain[d.id];
            const pct = pd.total ? Math.round((pd.correct / pd.total) * 100) : 0;
            return `
            <div class="domain-row">
              <div class="domain-row-head">
                <span class="pill dot d-${d.id}">${esc(d.short)}</span>
                <span>${pd.correct}/${pd.total} · ${pct}%</span>
              </div>
              <div class="bar"><span style="width:${pct}%;background:${d.hex}"></span></div>
            </div>`;
          }).join("")}
        </div>
        <h3>Review every question</h3>
        <div class="exam-review">
          ${this.questions
            .map((item, i) => {
              const chosen = this.answers[i];
              const correctIdx = item.options.findIndex((o) => o.correct);
              const isCorrect = chosen != null && item.options[chosen]?.correct;
              return `
            <details class="review-item ${isCorrect ? "ok" : "no"}">
              <summary>
                <span class="review-mark">${isCorrect ? "✓" : "✗"}</span>
                Q${i + 1}. ${esc(item.q.question)}
              </summary>
              <div class="review-body">
                <p><strong>Your answer:</strong> ${
                  chosen != null ? esc(item.options[chosen].text) : "<em>skipped</em>"
                }</p>
                ${
                  !isCorrect
                    ? `<p><strong>Correct answer:</strong> ${esc(item.options[correctIdx].text)}</p>`
                    : ""
                }
                <p>${esc(item.q.explanation)}</p>
              </div>
            </details>`;
            })
            .join("")}
        </div>
        <div class="exam-controls">
          <button class="btn btn-primary exam-retake">Take another exam</button>
          <a class="btn btn-ghost" href="${import.meta.env.BASE_URL.replace(/\/$/, "")}/progress">View progress</a>
        </div>
      </div>
    `;
    this.mount
      .querySelector(".exam-retake")
      ?.addEventListener("click", () => this.renderStart());
  }
}

export function initExam(): void {
  const root = document.querySelector<HTMLElement>("[data-exam]");
  if (!root) return;
  const script = root.querySelector<HTMLScriptElement>(
    'script[type="application/json"]',
  );
  if (!script) return;
  try {
    const pool = JSON.parse(script.textContent || "[]") as Question[];
    if (pool.length) new Exam(root, pool);
  } catch (e) {
    console.error("Failed to init exam", e);
  }
}
