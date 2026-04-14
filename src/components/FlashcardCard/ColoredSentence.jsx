import styles from './FlashcardCard.module.css';

export function ColoredSentence({ segments }) {
  if (!segments?.length) return null;
  return (
    <p className={styles.sentence}>
      {segments.map((seg, i) => {
        if (!seg.color) return <span key={i} style={{ color: '#2D2D2D' }}>{seg.text}</span>;

        const style = seg.colorType === 'bg'
          ? {
              backgroundColor: seg.color,
              borderRadius: '4px',
              padding: '2px 4px',
              fontWeight: 700,
            }
          : {
              color: seg.color,
              fontWeight: 700,
              textDecorationLine: 'underline',
              textDecorationColor: seg.color,
              textDecorationThickness: '2px',
              textUnderlineOffset: '3px',
            };

        return <span key={i} style={style}>{seg.text}</span>;
      })}
    </p>
  );
}
