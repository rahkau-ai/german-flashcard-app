import { FlashcardProvider } from './context/FlashcardContext.jsx';
import { Header } from './components/Header.jsx';
import { DeckSelector } from './components/DeckSelector.jsx';
import { FlashcardCard } from './components/FlashcardCard/FlashcardCard.jsx';
import { CardControls } from './components/CardControls.jsx';
import { ProgressBar } from './components/ProgressBar.jsx';
import { FileUploader } from './components/FileUploader.jsx';
import styles from './App.module.css';

export default function App() {
  return (
    <FlashcardProvider>
      <div className={styles.layout}>
        <div className={styles.topBar}>
          <Header />
          <DeckSelector />
        </div>

        <main className={styles.main}>
          <FlashcardCard />
        </main>

        <footer className={styles.footer}>
          <CardControls />
          <ProgressBar />
          <FileUploader />
        </footer>
      </div>
    </FlashcardProvider>
  );
}
