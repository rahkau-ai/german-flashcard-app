import { useFlashcards } from '../context/FlashcardContext.jsx';
import styles from './CardControls.module.css';

export function CardControls() {
  const { state, dispatch, totalCount } = useFlashcards();
  const { currentIndex } = state;

  return (
    <div className={styles.controls}>
      <button
        className={styles.btn}
        onClick={() => dispatch({ type: 'PREV' })}
        disabled={currentIndex === 0}
        aria-label="Previous card"
      >
        ←
      </button>

      <span className={styles.counter}>
        {currentIndex + 1} <span className={styles.sep}>/</span> {totalCount}
      </span>

      <button
        className={styles.btn}
        onClick={() => dispatch({ type: 'NEXT' })}
        disabled={currentIndex >= totalCount - 1}
        aria-label="Next card"
      >
        →
      </button>
    </div>
  );
}
