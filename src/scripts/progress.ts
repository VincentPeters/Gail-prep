/**
 * Progress dashboard — reads the local store and renders overall mastery,
 * per-domain accuracy, exam history, and flashcard confidence.
 */
import { DOMAINS } from "../data/domains";
import {
  getQuestionStats,
  getExams,
  getFlashcardRatings,
  resetAll,
} from "./storage";

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Totals {
  cardCounts: Record<string, number>; // total flashcards per domain (from page)
  questionCounts: Record<string, number>; // total questions per domain (from page)
}

function render(mount: HTMLElement, totals: Totals): void {
  const stats = getQuestionStats();
  const exams = getExams();
  const ratings = getFlashcardRatings();

  const statValues = Object.values(stats);
  const totalSeen = statValues.reduce((s, v) => s + v.seen, 0);
  const totalCorrect = statValues.reduce((s, v) => s + v.correct, 0);
  const overallAcc = totalSeen ? Math.round((totalCorrect / totalSeen) * 100) : 0;
  const uniqueAnswered = statValues.length;
  const totalQuestions =
    Object.values(totals.questionCounts).reduce((a, b) => a + b, 0) || 0;
  const coverage = totalQuestions
    ? Math.round((uniqueAnswered / totalQuestions) * 100)
    : 0;
  const knownCards = Object.values(ratings).filter((r) => r === "known").length;
  const totalCards =
    Object.values(totals.cardCounts).reduce((a, b) => a + b, 0) || 0;

  const bestExam = exams.reduce(
    (best, e) => (e.score > best ? e.score : best),
    0,
  );

  if (!totalSeen && !exams.length && !Object.keys(ratings).length) {
    mount.innerHTML = `
      <div class="card card-pad empty-state">
        <h2>No progress yet</h2>
        <p>Take a quiz, run a mock exam, or study some flashcards — your results
        appear here automatically. Everything is saved privately in your browser.</p>
        <div class="empty-actions">
          <a class="btn btn-primary" href="${base}/quizzes">Start a quiz</a>
          <a class="btn btn-ghost" href="${base}/exam">Take a mock exam</a>
        </div>
      </div>`;
    return;
  }

  // Per-domain accuracy from question stats
  const domainStats = DOMAINS.map((d) => {
    const qs = statValues.filter((v) => v.domain === d.id);
    const seen = qs.reduce((s, v) => s + v.seen, 0);
    const correct = qs.reduce((s, v) => s + v.correct, 0);
    const answeredUnique = qs.length;
    const total = totals.questionCounts[d.id] || 0;
    return {
      d,
      seen,
      correct,
      acc: seen ? Math.round((correct / seen) * 100) : 0,
      coverage: total ? Math.round((answeredUnique / total) * 100) : 0,
    };
  });

  mount.innerHTML = `
    <div class="grid cols-4 stat-row">
      <div class="card card-pad stat">
        <span class="stat-label">Overall accuracy</span>
        <span class="stat-value">${overallAcc}%</span>
        <span class="stat-sub">${totalCorrect}/${totalSeen} answered</span>
      </div>
      <div class="card card-pad stat">
        <span class="stat-label">Question coverage</span>
        <span class="stat-value">${coverage}%</span>
        <span class="stat-sub">${uniqueAnswered}/${totalQuestions} seen</span>
      </div>
      <div class="card card-pad stat">
        <span class="stat-label">Best mock exam</span>
        <span class="stat-value">${exams.length ? bestExam + "%" : "—"}</span>
        <span class="stat-sub">${exams.length} attempt${exams.length === 1 ? "" : "s"}</span>
      </div>
      <div class="card card-pad stat">
        <span class="stat-label">Flashcards known</span>
        <span class="stat-value">${knownCards}</span>
        <span class="stat-sub">of ${totalCards}</span>
      </div>
    </div>

    <h2>Accuracy by domain</h2>
    <div class="card card-pad">
      ${domainStats
        .map(
          (s) => `
        <div class="domain-row">
          <div class="domain-row-head">
            <span class="pill dot d-${s.d.id}">${s.d.short}</span>
            <span>${s.seen ? s.acc + "% · " + s.correct + "/" + s.seen : "not started"}</span>
          </div>
          <div class="bar"><span style="width:${s.acc}%;background:${s.d.hex}"></span></div>
          <div class="domain-row-sub">Coverage: ${s.coverage}% of this domain's questions</div>
        </div>`,
        )
        .join("")}
    </div>

    <h2>Mock exam history</h2>
    ${
      exams.length
        ? `<div class="card card-pad">
             <div class="exam-history">
               ${exams
                 .slice()
                 .reverse()
                 .map(
                   (e) => `
                 <div class="history-row ${e.passed ? "pass" : "fail"}">
                   <span class="history-score">${e.score}%</span>
                   <span class="history-verdict">${e.passed ? "Pass" : "Below target"}</span>
                   <span class="history-detail">${e.correct}/${e.total}</span>
                   <span class="history-date">${fmtDate(e.date)}</span>
                 </div>`,
                 )
                 .join("")}
             </div>
           </div>`
        : `<div class="card card-pad"><p>No mock exams taken yet. <a href="${base}/exam">Take one →</a></p></div>`
    }

    <div class="reset-zone">
      <button class="btn btn-ghost reset-all">Reset all progress</button>
    </div>
  `;

  mount.querySelector(".reset-all")?.addEventListener("click", () => {
    if (window.confirm("Erase all quiz, exam, and flashcard progress?")) {
      resetAll();
      render(mount, totals);
    }
  });
}

let base = "";

export function initProgress(): void {
  const mount = document.querySelector<HTMLElement>("[data-progress]");
  if (!mount) return;
  base = (mount.dataset.base || "").replace(/\/$/, "");
  let totals: Totals = { cardCounts: {}, questionCounts: {} };
  try {
    totals = JSON.parse(mount.dataset.totals || "{}");
  } catch {
    /* ignore */
  }
  render(mount, totals);
}
