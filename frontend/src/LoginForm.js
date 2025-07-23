export function LoginForm(params) {
  const handleSubmit = (e) => {
    e.preventDefault();
    params.login();
  };

  // Helper function to get user display name
  const getUserDisplayName = (currentUser) => {
    if (!currentUser) return '';
    if (typeof currentUser === 'string') return currentUser;
    if (currentUser.user) return currentUser.user;
    return 'User';
  };

  // Helper function to get user avatar letter
  const getUserAvatarLetter = (currentUser) => {
    const displayName = getUserDisplayName(currentUser);
    return displayName ? displayName.charAt(0).toUpperCase() : 'U';
  };

  const userDisplayName = getUserDisplayName(params.currentUser);
  const avatarLetter = getUserAvatarLetter(params.currentUser);

  return (
    <div>
      {params.currentUser ? (
        <div className="user-info">
          <div className="user-avatar">
            {avatarLetter}
          </div>
          <span className="user-welcome">Welcome, {userDisplayName}</span>
          <button className="login-btn" onClick={params.login}>
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="text" 
            placeholder="Username"
            value={params.credentials?.user || ''}
            onChange={(e) => params.setCredentials({...params.credentials, user: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            value={params.credentials?.password || ''}
            onChange={(e) => params.setCredentials({...params.credentials, password: e.target.value})}
            required
          />
          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>
      )}
    </div>
  );
}
