export function LoginForm(params) {
  const handleSubmit = (e) => {
    e.preventDefault();
    params.login();
  };

  return (
    <div className="lm-card" style={{ marginBottom: '20px', fontSize: '14px' }}>
      {params.currentUser ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ margin: '0' }}>
            Welcome, <strong>{params.currentUser.user}</strong>
          </span>
          <button 
            onClick={params.login}
            className="lm-button lm-button--secondary lm-button--small"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <strong style={{ marginBottom: '8px', display: 'block' }}>Login</strong>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input 
                type="text" 
                placeholder="Username"
                value={params.credentials?.user || ''}
                onChange={(e) => params.setCredentials({...params.credentials, user: e.target.value})}
                className="lm-input lm-input--small"
                style={{ width: '120px' }}
              />
              <input 
                type="password" 
                placeholder="Password"
                value={params.credentials?.password || ''}
                onChange={(e) => params.setCredentials({...params.credentials, password: e.target.value})}
                className="lm-input lm-input--small"
                style={{ width: '120px' }}
              />
            </div>
            <button 
              type="submit"
              className="lm-button lm-button--primary lm-button--small"
            >
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
