import React, { useState, useEffect } from 'react';
import { NewsReader } from './NewsReader';
import { TopStoriesScroll } from './TopStoriesScroll';
import { MagazineMode } from './MagazineMode';
import { LoginForm } from './LoginForm';
import { ErrorNotification } from './ErrorNotification';
import './App.css';

function App() {
  // Check if we're in magazine mode
  const urlParams = new URLSearchParams(window.location.search);
  const isMagazineMode = urlParams.get('mode') === 'magazine';

  // Lift login state up to App level
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ user: "", password: "" });
  
  // State for current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // State for error notifications
  const [error, setError] = useState(null);
  
  const urlUsersAuth = "/users/authenticate";

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time for display
  const formatDateTime = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };
    return date.toLocaleDateString('en-US', options);
  };

  async function login() {
    if (currentUser !== null) {
      setCurrentUser(null);
      setCredentials({ user: "", password: "" });
      return;
    }

    try {
      const response = await fetch(urlUsersAuth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.status === 200) {
        // Login successful
        console.log("login successful for user: ", credentials.user);
        setCurrentUser({ user: credentials.user });
        setCredentials({ user: "", password: "" });
      } else {
        // Login failed - get error message from response
        const errorMessage = await response.text();
        console.error('Login failed:', errorMessage);
        setError('Login failed: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Login failed. Please check your connection and try again.');
    }
  }

  if (isMagazineMode) {
    return <MagazineMode />;
  }

  return (
    <div className="App">
      {/* Error Notification */}
      <ErrorNotification 
        error={error} 
        onClose={() => setError(null)} 
      />
      
      <header className="lm-header">
        <div className="lm-header__brand" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1' }}>
            <img 
              src="/logo.jpeg" 
              alt="NewsDash Logo" 
              style={{ 
                height: '40px', 
                width: 'auto',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <h1 className="lm-header__brand-text">NewsDash</h1>
          </div>
          
          <div style={{ 
            flex: '2', 
            textAlign: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {formatDateTime(currentDateTime)}
          </div>
          
          <div style={{ minWidth: '280px', flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
            <LoginForm 
              login={login}
              credentials={credentials}
              currentUser={currentUser}
              setCredentials={setCredentials} 
            />
          </div>
        </div>
      </header>
      
      <TopStoriesScroll />
      
      <main className="lm-content">
        <NewsReader 
          currentUser={currentUser}
          credentials={credentials}
          setCredentials={setCredentials}
          login={login}
          onError={setError}
        />
      </main>
    </div>
  );
}

export default App;
