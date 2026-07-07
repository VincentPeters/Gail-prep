/**
 * Flashcard deck — flip to reveal, rate known/unknown (persisted),
 * shuffle, and filter to cards you're still learning.
 */
import type { Flashcard } from "../data/types";
import { getFlashcardRatings, setFlashcardRating } from "./storage";

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

class Deck {
  private root: HTMLElement;
  private mount: HTMLElement;
  private all: Flashcard[];
  private deck: Flashcard[];
  private idx = 0;
  private flipped = false;
  private onlyUnknown = false;

  constructor(root: HTMLElement, cards: Flashcard[]) {
    this.root = root;
    this.mount = root.querySelector(".deck-mount") as HTMLElement;
    this.all = cards;
    this.deck = shuffle(cards);
    this.render();
  }

  private buildDeck(): void {
    const ratings = getFlashcardRatings();
    let cards = this.all;
    if (this.onlyUnknown) {
      cards = cards.filter((c) => ratings[c.id] !== "known");
    }
    this.deck = shuffle(cards);
    this.idx = 0;
    this.flipped = false;
  }

  private render(): void {
    if (!this.deck.length) {
      this.mount.innerHTML = `
        <div class="deck-done card card-pad">
          <h3>🎉 All caught up</h3>
          <p>You've marked every card in this set as known.</p>
          <button class="btn btn-ghost deck-reset-filter">Show all cards</button>
        </div>`;
      this.mount
        .querySelector(".deck-reset-filter")
        ?.addEventListener("click", () => {
          this.onlyUnknown = false;
          this.buildDeck();
          this.render();
          this.syncToolbar();
        });
      return;
    }
    if (this.idx >= this.deck.length) this.idx = 0;
    const card = this.deck[this.idx];
    const ratings = getFlashcardRatings();
    const known = ratings[card.id] === "known";
    this.mount.innerHTML = `
      <div class="deck-meta">
        <span class="pill dot d-${card.domain}">Card ${this.idx + 1} / ${this.deck.length}</span>
        ${known ? `<span class="pill" style="color:var(--correct)">✓ known</span>` : ""}
      </div>
      <button class="flashcard ${this.flipped ? "flipped" : ""}" aria-label="Flip card">
        <div class="flashcard-inner">
          <div class="flashcard-face front">
            <span class="fc-label">Prompt</span>
            <p>${esc(card.front)}</p>
            <span class="fc-hint">Click to flip</span>
          </div>
          <div class="flashcard-face back">
            <span class="fc-label">Answer</span>
            <p>${esc(card.back)}</p>
          </div>
        </div>
      </button>
      <div class="deck-actions">
        <button class="btn btn-ghost deck-prev">← Prev</button>
        <button class="btn btn-ghost deck-unknown">Still learning</button>
        <button class="btn btn-primary deck-known">I know this ✓</button>
        <button class="btn btn-ghost deck-next">Next →</button>
      </div>
    `;
    const fc = this.mount.querySelector(".flashcard");
    fc?.addEventListener("click", () => {
      this.flipped = !this.flipped;
      fc.classList.toggle("flipped", this.flipped);
    });
    this.mount.querySelector(".deck-prev")?.addEventListener("click", () => {
      this.idx = (this.idx - 1 + this.deck.length) % this.deck.length;
      this.flipped = false;
      this.render();
    });
    this.mount.querySelector(".deck-next")?.addEventListener("click", () =>
      this.advance(),
    );
    this.mount.querySelector(".deck-known")?.addEventListener("click", () => {
      setFlashcardRating(card.id, "known");
      this.advance();
    });
    this.mount.querySelector(".deck-unknown")?.addEventListener("click", () => {
      setFlashcardRating(card.id, "unknown");
      this.advance();
    });
  }

  private advance(): void {
    this.idx = (this.idx + 1) % this.deck.length;
    this.flipped = false;
    this.render();
  }

  private syncToolbar(): void {
    const btn = this.root.querySelector<HTMLButtonElement>(".deck-filter");
    if (btn) btn.classList.toggle("active", this.onlyUnknown);
  }

  bindToolbar(): void {
    this.root.querySelector(".deck-shuffle")?.addEventListener("click", () => {
      this.buildDeck();
      this.render();
    });
    this.root.querySelector(".deck-filter")?.addEventListener("click", () => {
      this.onlyUnknown = !this.onlyUnknown;
      this.buildDeck();
      this.render();
      this.syncToolbar();
    });
  }
}

export function initFlashcards(): void {
  const root = document.querySelector<HTMLElement>("[data-deck]");
  if (!root) return;
  const script = root.querySelector<HTMLScriptElement>(
    'script[type="application/json"]',
  );
  if (!script) return;
  try {
    const cards = JSON.parse(script.textContent || "[]") as Flashcard[];
    if (cards.length) {
      const deck = new Deck(root, cards);
      deck.bindToolbar();
    }
  } catch (e) {
    console.error("Failed to init flashcards", e);
  }
}
