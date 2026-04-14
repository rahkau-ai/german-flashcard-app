import styles from './FlashcardCard.module.css';
import { ColoredSentence } from './ColoredSentence.jsx';

export function CardFront({ card }) {
  const { signal, word, grammar, sentence } = card.side2;
  return (
    <div className={styles.face + ' ' + styles.front}>
      <span className={styles.signal} aria-label={signal.label} title={signal.label}>
        {signal.emoji}
      </span>
      {word && <h2 className={styles.word}>{word}</h2>}
      {grammar && <p className={styles.grammar}>{grammar}</p>}
      <div className={styles.divider} />
      <ColoredSentence segments={sentence.segments} />
      <p className={styles.tapHint}>Tap to flip</p>
    </div>
  );
}
