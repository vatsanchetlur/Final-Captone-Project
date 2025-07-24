import { NewsReader } from './NewsReader';
import { TopStoriesScroll } from './TopStoriesScroll';
import { MagazineMode } from './MagazineMode';
import './App.css';

function App() {
  // Check if we're in magazine mode
  const urlParams = new URLSearchParams(window.location.search);
  const isMagazineMode = urlParams.get('mode') === 'magazine';

  if (isMagazineMode) {
    return <MagazineMode />;
  }

  return (
    <div className="App">
      <header className="lm-header">
        <div className="lm-header__brand">
          <h1 className="lm-header__brand-text">GPT News Finder</h1>
        </div>
      </header>
      
      <TopStoriesScroll />
      
      <main className="lm-content">
        <NewsReader />
      </main>
    </div>
  );
}

export default App;
