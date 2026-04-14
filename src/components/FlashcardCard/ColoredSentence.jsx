import styles from './FlashcardCard.module.css';

export function ColoredSentence({ segments }) {
  if (!segments?.length) return null;
  return (
    <p className={styles.sentence}>
      {segments.map((seg, i) => {
        if (!seg.color) return <span key={i}>{seg.text}</span>;
        const style = seg.colorType === 'bg'
          ? { backgroundColor: seg.color, borderRadius: '3px', padding: '0 2px' }
          : { color: seg.color, fontWeight: 700 };
        return <span key={i} style={style}>{seg.text}</span>;
      })}
    </p>
  );
}
