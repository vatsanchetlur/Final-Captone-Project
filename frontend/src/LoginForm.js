export function LoginForm(params) {
  const handleSubmit = (e) => {
    e.preventDefault();
    params.login();
  };

  return (
    <div>
      <h3>Login Form</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username"
          value={params.credentials?.user || ''}
          onChange={(e) => params.setCredentials({...params.credentials, user: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password"
          value={params.credentials?.password || ''}
          onChange={(e) => params.setCredentials({...params.credentials, password: e.target.value})}
        />
        <button type="submit">{params.currentUser ? 'Logout' : 'Login'}</button>
      </form>
      {params.currentUser && (
        <p>Logged in as: {params.currentUser.user}</p>
      )}
    </div>
  );
}
