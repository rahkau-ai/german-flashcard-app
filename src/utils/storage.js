const PROGRESS_KEY = 'flashcard-progress';
const CUSTOM_DECKS_KEY = 'flashcard-custom-decks';

export function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (_) {}
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function saveCustomDecks(decks, cards) {
  try {
    localStorage.setItem(CUSTOM_DECKS_KEY, JSON.stringify({ decks, cards }));
  } catch (_) {}
}

export function loadCustomDecks() {
  try {
    const raw = localStorage.getItem(CUSTOM_DECKS_KEY);
    return raw ? JSON.parse(raw) : { decks: [], cards: [] };
  } catch (_) {
    return { decks: [], cards: [] };
  }
}
