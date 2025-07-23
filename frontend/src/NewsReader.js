import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { useState, useEffect } from 'react';
import { exampleQuery ,exampleData } from './data';
import { SavedQueries } from './SavedQueries';
import { LoginForm } from './LoginForm';

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery); // latest query send to newsapi
  const [data, setData] = useState(exampleData);   // current data returned from newsapi
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: "", password: "" });
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
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
        alert("Error during authentication! " + credentials.user + "/" + credentials.password);
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
      alert("Log in if you want to create new queries!")
      return;
    }

    if (savedQueries.length >= 3 && currentUserMatches("guest")) {
      alert("guest users cannot submit new queries once saved query count is 3 or greater!")
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
          <h1>NewsDash</h1>
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
          {/* Query Form */}
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

          {/* Articles List */}
          <div className="card">
            <div className="card-title">Latest Headlines</div>
            <Articles query={query} data={data} loading={isLoadingArticles} />
          </div>

          {/* Saved Queries */}
          <div className="card">
            <div className="card-title">Saved Searches</div>
            <div className="card-content">
              <SavedQueries 
                savedQueries={savedQueries}
                selectedQueryName={query.queryName}
                onQuerySelect={onSavedQuerySelect}
                onClearQueries={onClearQueries} />
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
      </div>
    </div>
  )
}


