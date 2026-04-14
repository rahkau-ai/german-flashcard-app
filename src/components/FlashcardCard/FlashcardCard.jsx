import { useFlashcards } from '../../context/FlashcardContext.jsx';
import { useSwipe } from '../../hooks/useSwipe.js';
import { CardFront } from './CardFront.jsx';
import { CardBack } from './CardBack.jsx';
import styles from './FlashcardCard.module.css';

export function FlashcardCard() {
  const { state, dispatch, currentCard } = useFlashcards();

  const { onTouchStart, onTouchEnd } = useSwipe({
    onSwipeLeft:  () => dispatch({ type: 'NEXT' }),
    onSwipeRight: () => dispatch({ type: 'PREV' }),
    onTap:        () => dispatch({ type: 'FLIP' }),
  });

  const handleClick = () => dispatch({ type: 'FLIP' });

  if (!currentCard) {
    return <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No cards available.</p>;
  }

  return (
    <div
      className={styles.container}
      onClick={handleClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="button"
      tabIndex={0}
      aria-label={state.isFlipped ? 'Card back — English side' : 'Card front — German side'}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div className={styles.inner + (state.isFlipped ? ' ' + styles.flipped : '')}>
        <CardFront card={currentCard} />
        <CardBack card={currentCard} />
      </div>
    </div>
  );
}
