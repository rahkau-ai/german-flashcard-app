import { useRef, useState } from 'react';
import { useFlashcards } from '../context/FlashcardContext.jsx';
import { parseDocx } from '../utils/docxParser.js';
import styles from './FileUploader.module.css';

export function FileUploader() {
  const { dispatch } = useFlashcards();
  const inputRef = useRef(null);
  const [status, setStatus] = useState(null); // null | 'loading' | { count, title } | 'error'

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith('.docx')) return;
    setStatus('loading');
    try {
      const buf = await file.arrayBuffer();
      const title = file.name.replace(/\.docx$/i, '');
      const { deck, cards } = await parseDocx(buf, title);
      dispatch({ type: 'ADD_DECK', deck, cards });
      setStatus({ count: cards.length, title: deck.title });
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('error');
    }
  };

  const onChange = (e) => handleFile(e.target.files?.[0]);

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        type="file"
        accept=".docx"
        onChange={onChange}
        className={styles.hidden}
        aria-label="Upload a .docx source file"
      />
      <button
        className={styles.btn}
        onClick={() => { setStatus(null); inputRef.current?.click(); }}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Parsing…' : '+ Add source (.docx)'}
      </button>

      {status && status !== 'loading' && status !== 'error' && (
        <p className={styles.success}>
          Added {status.count} cards from "{status.title}"
        </p>
      )}
      {status === 'error' && (
        <p className={styles.error}>Could not parse file. Check it is a valid .docx.</p>
      )}
    </div>
  );
}
