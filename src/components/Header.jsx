import { useFlashcards } from '../context/FlashcardContext.jsx';
import styles from './Header.module.css';

export function Header() {
  const { state } = useFlashcards();
  const currentDeck = state.allDecks.find(d => d.id === state.currentDeckId);

  return (
    <header className={styles.header}>
      <h1 className={styles.appName}>German Flashcards</h1>
      {currentDeck && (
        <p className={styles.deckName}>{currentDeck.title}</p>
      )}
    </header>
  );
}
