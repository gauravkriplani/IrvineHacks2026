import { useState } from 'react'
import { AOMAction, AOMInput, AOMLink } from '../../aom-wrappers'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (email === 'test@example.com' && password === 'password123') {
      setStatus('Login successful!')
    } else {
      setStatus('Invalid credentials')
    }
  }

  return (
    <div className="login-container">
      <h1>Log In</h1>
      <p className="status-msg">{status}</p>

      <form onSubmit={handleLogin} className="login-form">
        <label>Email</label>
        <AOMInput
          id="auth.login.email_address"
          description="Enter your email address"
          inputType="email"
          group="auth"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
          />
        </AOMInput>

        <label>Password</label>
        <AOMInput
          id="auth.login.password"
          description="Enter your password"
          inputType="password"
          group="auth"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password123"
          />
        </AOMInput>

        <AOMAction
          id="auth.login.submit"
          description="Submit login form"
          safety={0.9}
          group="auth"
        >
          <button type="submit">Log In</button>
        </AOMAction>
      </form>

      <div className="links">
        <AOMLink
          id="auth.login.forgot_password"
          description="Navigate to password reset page"
          destination="Forgot Password"
          group="auth"
        >
          <a href="#" onClick={(e) => { e.preventDefault(); setStatus('Redirecting to reset...') }}>
            Forgot password?
          </a>
        </AOMLink>

        <AOMLink
          id="auth.login.signup"
          description="Navigate to sign up page"
          destination="Sign Up"
          group="auth"
        >
          <a href="#" onClick={(e) => { e.preventDefault(); setStatus('Redirecting to signup...') }}>
            Create an account
          </a>
        </AOMLink>
      </div>
    </div>
  )
}

export default App
