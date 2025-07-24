import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { useState, useEffect } from 'react';
import { exampleQuery ,exampleData } from './data';
import { SavedQueries } from './SavedQueries';
import { LoginForm } from './LoginForm';
import { CustomModal } from './CustomModal';
import { LiveTickerBar } from './LiveTickerBar';
import logo from './assets/Let Me Ask GPT 1.jpeg';

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery); // latest query send to newsapi
  const [data, setData] = useState(exampleData);   // current data returned from newsapi
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: "", password: "" });
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  
  // Modal state management
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    showCancel: false
  });
  
  // Helper function to show modal
  const showModal = (title, message, type = 'info', onConfirm = null, showCancel = false) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      showCancel
    });
  };
  
  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const urlNews="/news"
  const [savedQueries, setSavedQueries] = useState([{ ...exampleQuery }]);
  const urlQueries = "/queries"
  const urlUsersAuth = "/users/authenticate"

  useEffect(() => {
    getNews(query);
  }, [query])

  useEffect(() => {
    getQueryList();
  }, [])

  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
      if (response.ok) {
        const data = await response.json();
        console.log("savedQueries has been retrieved: ");
        // Ensure data is always an array
        setSavedQueries(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setSavedQueries([]); // Fallback to empty array
    }
  }


  async function login() {
  if (currentUser !== null) {
    // logout
    setCurrentUser(null);
  } else {
    // login
    try {
      const response = await fetch(urlUsersAuth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (response.status === 200) {
        setCurrentUser({ ...credentials });
        setCredentials({ user: "", password: "" });
      } else {
        showModal(
          'Login Failed',
          `We couldn't authenticate your credentials.\n\nUsername: ${credentials.user}\n\nPlease check your username and password and try again.`,
          'error'
        );
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
      setCurrentUser(null);
    }
  }
}


  async function saveQueryList(savedQueries) {
    try {
      const response = await fetch(urlQueries, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedQueries),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("savedQueries array has been persisted:");
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
  }

  // clear button for saved query
  function onClearQueries() {
    setSavedQueries([]);
    saveQueryList([]);
    setData({}); // Clear the articles data
    setQuery({}); // Clear the current query
    setQueryFormObject({}); // Clear the query form
  }

  // delete individual saved query
  function onDeleteQuery(queryToDelete) {
    showModal(
      'Delete Query',
      `Are you sure you want to delete "${queryToDelete.queryName}"?\n\nThis will permanently remove this saved search from your collection.\n\nThis action cannot be undone.`,
      'error',
      () => {
        const updatedQueries = savedQueries.filter(query => 
          query.queryName !== queryToDelete.queryName
        );
        setSavedQueries(updatedQueries);
        saveQueryList(updatedQueries);
        
        // If the deleted query was the currently selected one, clear the current display
        if (query.queryName === queryToDelete.queryName) {
          setData({});
          setQuery({});
          setQueryFormObject({});
        }
      },
      true
    );
  }

  function currentUserMatches(user) {
    if (currentUser) {
      if (currentUser.user) {
        if (currentUser.user === user) {
          return true;
        }
      }
    }
    return false;
  }


  function onFormSubmit(queryObject) {
    if (currentUser === null){
      showModal(
        'Login Required',
        'You need to be logged in to create and save new search queries.\n\nPlease log in using the form on the left to continue.',
        'warning'
      );
      return;
    }

    if (savedQueries.length >= 3 && currentUserMatches("guest")) {
      showModal(
        'Query Limit Reached',
        `Guest users can only save up to 3 search queries.\n\nYou currently have ${savedQueries.length} saved queries.\n\nPlease delete some existing queries or contact support to upgrade your account.`,
        'warning'
      );
      return;
    }
    let newSavedQueries = [];
    newSavedQueries.push(queryObject);
    for (let query of savedQueries) {
      if (query.queryName !== queryObject.queryName) {
        newSavedQueries.push(query);
      }
    }
    console.log(JSON.stringify(newSavedQueries));
    saveQueryList(newSavedQueries);
    setSavedQueries(newSavedQueries);
    setQuery(queryObject);

  }

  async function getNews(queryObject) {
  console.log('getNews called with:', JSON.stringify(queryObject, null, 2));
  if (queryObject.q || queryObject.country) {
    setIsLoadingArticles(true);
    try {
      console.log('Sending request to:', urlNews, 'with data:', JSON.stringify(queryObject, null, 2));
      const response = await fetch(urlNews, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryObject),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received data:', data);
      console.log('Articles array:', data.articles);
      console.log('Articles length:', data.articles ? data.articles.length : 'undefined');
      console.log('Total results:', data.totalResults);
      setData(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setData({}); // Set empty data on error
    } finally {
      setIsLoadingArticles(false);
    }
  } else {
    console.log('No valid search criteria, clearing data');
    setData({});
    setIsLoadingArticles(false);
  }
}

  return (
    <div>
      {/* CNN-Style Header */}
      <header className="app-header">
        {/* Top Bar */}
        <div className="header-top">
          <div className="header-top-content">
            <div className="header-date">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="header-live-updates">
              <div className="live-indicator"></div>
              Live Updates
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="header-main">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={logo} 
              alt="NewsDash Logo" 
              style={{
                height: '100px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <h1 style={{ margin: 0 }}>NewsDash</h1>
          </div>
          <nav className="header-nav">
            <a href="#" className="nav-item">World</a>
            <a href="#" className="nav-item">Politics</a>
            <a href="#" className="nav-item">Business</a>
            <a href="#" className="nav-item">Tech</a>
            <a href="#" className="nav-item">Sports</a>
            <a href="#" className="nav-item">Opinion</a>
          </nav>
          <div className="header-login">
            <LoginForm login={login}
              credentials={credentials}
              currentUser={currentUser}
              setCredentials={setCredentials} />
          </div>
        </div>
      </header>

      {/* Breaking News Bar */}
      <div className="breaking-news">
        <div className="breaking-news-content">
          <div className="breaking-label">Breaking</div>
          <div className="breaking-text">
            Stay informed with the latest news from around the world • Create custom queries to follow specific topics • Breaking news updates available 24/7
          </div>
        </div>
      </div>

      <div className="app-container">
        {/* Main Content Grid */}
        <section className="main-content">
          {/* Query Form - Left Side */}
          <div className="card">
            <div className="card-title">Search News</div>
            <div className="card-content">
              <QueryForm
                currentUser={currentUser}
                setFormObject={setQueryFormObject}
                formObject={queryFormObject}
                submitToParent={onFormSubmit} />
            </div>
          </div>

          {/* Articles List - Center (More Space) */}
          <div className="card">
            <div className="card-title">Latest Headlines</div>
            <Articles query={query} data={data} loading={isLoadingArticles} />
          </div>

          {/* Saved Queries - Right Side */}
          <div className="card">
            <div className="card-title">Saved Searches</div>
            <div className="card-content">
              <SavedQueries 
                savedQueries={savedQueries}
                selectedQueryName={query.queryName}
                onQuerySelect={onSavedQuerySelect}
                onClearQueries={onClearQueries}
                onDeleteQuery={onDeleteQuery} />
            </div>
          </div>
        </section>

        {/* Test Links */}
        <div className="test-links">
          <h3>Developer Tools</h3>
          <div className="test-links-container">
            <a 
              href="/api-tests.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="test-link"
            >
              Backend API Tests
            </a>
            <a 
              href="/frontend-tests.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="test-link secondary"
            >
              Frontend UI Tests
            </a>
          </div>
        </div>
        
        {/* Live Ticker Bar */}
        <div className="ticker-container">
          <LiveTickerBar />
        </div>
      </div>

      {/* Custom Modal Component */}
      {modal.isOpen && (
        <CustomModal 
          isOpen={modal.isOpen}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onConfirm={modal.onConfirm}
          onClose={closeModal}
          showCancel={modal.showCancel}
        />
      )}
    </div>
  )
}


