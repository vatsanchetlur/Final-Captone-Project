import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { useState, useEffect, useCallback } from 'react';
import { exampleQuery ,exampleData } from './data';
import { SavedQueries } from './SavedQueries';

export function NewsReader({ currentUser, credentials, setCredentials, login, onError }) {
  const [query, setQuery] = useState(exampleQuery); // latest query send to newsapi
  const [data, setData] = useState(exampleData);   // current data returned from newsapi
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const urlNews="/news"
  const [savedQueries, setSavedQueries] = useState([{ ...exampleQuery }]);
  const urlQueries = "/queries"

  const getNews = useCallback(async (queryObject) => {
    try {
      const response = await fetch(urlNews, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryObject),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
      
      // Update the saved query with the results count
      if (data.totalResults !== undefined) {
        setSavedQueries(prevSavedQueries => {
          return prevSavedQueries.map(savedQuery => {
            if (savedQuery.queryName === queryObject.queryName) {
              return { ...savedQuery, totalResults: data.totalResults };
            }
            return savedQuery;
          });
        });
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      onError && onError('Failed to fetch news. Please check your connection and try again.');
    }
  }, [urlNews, onError]);

  useEffect(() => {
    // Only fetch news if query has valid content
    if (query && Object.keys(query).length > 0 && query.queryName) {
      getNews(query);
    }
  }, [query, getNews])

  useEffect(() => {
    getQueryList();
  }, [])

  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
      if (response.ok) {
        const data = await response.json();
        console.log("savedQueries has been retrieved: ");
        setSavedQueries(data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
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
    // Reset to initial state - load default top headlines
    setQuery(exampleQuery);
    setQueryFormObject({ ...exampleQuery });
    // The useEffect will automatically fetch news for the default query
  }

  // delete individual saved query
  function onDeleteQuery(queryToDelete) {
    const newSavedQueries = savedQueries.filter(query => query.queryName !== queryToDelete.queryName);
    setSavedQueries(newSavedQueries);
    saveQueryList(newSavedQueries);
    
    // If the deleted query was currently selected, clear the current view
    if (query.queryName === queryToDelete.queryName) {
      setData({}); // Clear the articles data
      setQuery({}); // Clear the current query
      setQueryFormObject({}); // Clear the query form
    }
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
      onError && onError("Please log in to create new queries!");
      return;
    }

    if (savedQueries.length >= 3 && currentUserMatches("guest")) {
      onError && onError("Guest users cannot submit new queries once saved query count is 3 or greater!");
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' }}>
        {/* Left Sidebar */}
        <div>
          {/* Search Section */}
          <div className="sidebar-section">
            <h2>Search News</h2>
            <QueryForm
              currentUser={currentUser}
              setFormObject={setQueryFormObject}
              formObject={queryFormObject}
              submitToParent={onFormSubmit}
              onError={onError}
            />
          </div>

          {/* Saved Searches Section */}
          <div className="sidebar-section">
            <h2>Saved Searches</h2>
            <SavedQueries 
              savedQueries={savedQueries}
              selectedQueryName={query.queryName}
              onQuerySelect={onSavedQuerySelect}
              onClearQueries={onClearQueries}
              onDeleteQuery={onDeleteQuery}
            />
          </div>
        </div>

        {/* Main Articles Area */}
        <div>
          <Articles query={query} data={data} />
        </div>
      </div>
    </div>
  );
}


