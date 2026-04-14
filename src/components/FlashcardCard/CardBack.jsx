import styles from './FlashcardCard.module.css';

export function CardBack({ card }) {
  const { wordTranslation, sentenceTranslation } = card.side1;
  return (
    <div className={styles.face + ' ' + styles.back}>
      <span className={styles.backLabel}>English</span>
      {wordTranslation && <h2 className={styles.wordBack}>{wordTranslation}</h2>}
      {wordTranslation && <div className={styles.divider} />}
      {sentenceTranslation && (
        <p className={styles.sentenceBack}>{sentenceTranslation}</p>
      )}
      <p className={styles.tapHint}>Tap to flip</p>
    </div>
  );
}
