import styles from './FlashcardCard.module.css';

// SIDE 1 — ENGLISH (shown first, before flip)
export function CardFront({ card }) {
  const { wordTranslation, sentenceTranslation } = card.side1;
  return (
    <div className={styles.face + ' ' + styles.front}>
      <span className={styles.sideLabel}>English</span>
      {wordTranslation && <h2 className={styles.word}>{wordTranslation}</h2>}
      {wordTranslation && <div className={styles.divider} />}
      {sentenceTranslation && (
        <p className={styles.sentenceEng}>{sentenceTranslation}</p>
      )}
      <p className={styles.tapHint}>Tap to see German</p>
    </div>
  );
}
