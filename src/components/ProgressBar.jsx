import { useFlashcards } from '../context/FlashcardContext.jsx';
import styles from './ProgressBar.module.css';

export function ProgressBar() {
  const { seenCount, totalCount } = useFlashcards();
  const pct = totalCount > 0 ? Math.round((seenCount / totalCount) * 100) : 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.label}>{seenCount} of {totalCount} studied</p>
    </div>
  );
}
