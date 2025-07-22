export function LoginForm(params) {
  return (
    <div>
      <h3>Login Form</h3>
      <form>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}