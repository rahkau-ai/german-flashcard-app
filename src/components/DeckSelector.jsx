import { useFlashcards } from '../context/FlashcardContext.jsx';
import styles from './DeckSelector.module.css';

export function DeckSelector() {
  const { state, dispatch } = useFlashcards();
  const { allDecks, currentDeckId } = state;

  if (allDecks.length <= 1) return null;

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="deck-select">Deck</label>
      <select
        id="deck-select"
        className={styles.select}
        value={currentDeckId}
        onChange={(e) => dispatch({ type: 'SELECT_DECK', deckId: e.target.value })}
      >
        {allDecks.map(deck => (
          <option key={deck.id} value={deck.id}>
            {deck.title} ({deck.cardCount})
          </option>
        ))}
      </select>
    </div>
  );
}
