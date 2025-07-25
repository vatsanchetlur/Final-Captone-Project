export function LoginForm(params) {
  const handleSubmit = (e) => {
    e.preventDefault();
    params.login();
  };

  return (
    <div style={{ fontSize: '14px' }}>
      {params.currentUser ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '8px 12px',
          borderRadius: '6px',
          color: 'white'
        }}>
          <span style={{ margin: '0' }}>
            Welcome, <strong>{params.currentUser.user}</strong>
          </span>
          <button 
            onClick={params.login}
            className="lm-button lm-button--secondary lm-button--small"
            style={{ marginLeft: '12px' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '8px 12px',
          borderRadius: '6px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Username"
                value={params.credentials?.user || ''}
                onChange={(e) => params.setCredentials({...params.credentials, user: e.target.value})}
                className="lm-input lm-input--small"
                style={{ width: '100px', fontSize: '12px' }}
              />
              <input 
                type="password" 
                placeholder="Password"
                value={params.credentials?.password || ''}
                onChange={(e) => params.setCredentials({...params.credentials, password: e.target.value})}
                className="lm-input lm-input--small"
                style={{ width: '100px', fontSize: '12px' }}
              />
              <button 
                type="submit"
                className="lm-button lm-button--primary lm-button--small"
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
