import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import seedData from '../data/flashcards.json';
import { saveProgress, loadProgress, saveCustomDecks, loadCustomDecks } from '../utils/storage.js';

// ─── Initial state ─────────────────────────────────────────────────────────────

function buildInitialState() {
  const { decks: customDecks, cards: customCards } = loadCustomDecks();
  const allDecks = [...seedData.decks, ...customDecks];
  const allCards = [...seedData.cards, ...customCards];

  const saved = loadProgress();
  const currentDeckId = saved?.currentDeckId || allDecks[0]?.id || null;
  const deckCards = allCards.filter(c => c.deckId === currentDeckId);

  return {
    allDecks,
    allCards,
    currentDeckId,
    deckCards,
    currentIndex: saved?.currentIndex ?? 0,
    isFlipped: false,
    seen: new Set(saved?.seen || []),
  };
}

// ─── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case 'FLIP':
      return { ...state, isFlipped: !state.isFlipped };

    case 'NEXT': {
      const next = Math.min(state.currentIndex + 1, state.deckCards.length - 1);
      const card = state.deckCards[next];
      const seen = new Set(state.seen);
      if (card) seen.add(card.id);
      return { ...state, currentIndex: next, isFlipped: false, seen };
    }

    case 'PREV': {
      const prev = Math.max(state.currentIndex - 1, 0);
      return { ...state, currentIndex: prev, isFlipped: false };
    }

    case 'SELECT_DECK': {
      const deckCards = state.allCards.filter(c => c.deckId === action.deckId);
      const firstCard = deckCards[0];
      const seen = new Set(state.seen);
      if (firstCard) seen.add(firstCard.id);
      return {
        ...state,
        currentDeckId: action.deckId,
        deckCards,
        currentIndex: 0,
        isFlipped: false,
        seen,
      };
    }

    case 'ADD_DECK': {
      const allDecks = [...state.allDecks, action.deck];
      const allCards = [...state.allCards, ...action.cards];
      const deckCards = action.cards;
      return {
        ...state,
        allDecks,
        allCards,
        currentDeckId: action.deck.id,
        deckCards,
        currentIndex: 0,
        isFlipped: false,
      };
    }

    case 'RESET_PROGRESS':
      return { ...state, currentIndex: 0, isFlipped: false, seen: new Set() };

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────

const FlashcardContext = createContext(null);

export function FlashcardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, buildInitialState);

  // Mark first card as seen on mount
  useEffect(() => {
    const first = state.deckCards[0];
    if (first && !state.seen.has(first.id)) {
      dispatch({ type: 'NEXT' }); // triggers seen update via NEXT, then reset
    }
  }, []); // eslint-disable-line

  // Persist progress
  useEffect(() => {
    saveProgress({
      currentDeckId: state.currentDeckId,
      currentIndex: state.currentIndex,
      seen: Array.from(state.seen),
    });
  }, [state.currentDeckId, state.currentIndex, state.seen]);

  // Persist custom decks
  useEffect(() => {
    const customDecks = state.allDecks.filter(d => !seedData.decks.find(s => s.id === d.id));
    const customCards = state.allCards.filter(c => !seedData.cards.find(s => s.id === c.id));
    saveCustomDecks(customDecks, customCards);
  }, [state.allDecks, state.allCards]);

  const currentCard = state.deckCards[state.currentIndex] || null;
  const seenCount = state.seen.size;
  const totalCount = state.deckCards.length;

  const value = useMemo(() => ({
    state,
    dispatch,
    currentCard,
    seenCount,
    totalCount,
  }), [state, currentCard, seenCount, totalCount]);

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards() {
  const ctx = useContext(FlashcardContext);
  if (!ctx) throw new Error('useFlashcards must be used inside FlashcardProvider');
  return ctx;
}
