import React from 'react'
import './loginsignup.css'
import { useNavigate } from 'react-router-dom'

function LoginSignup() {
  const [mode, setMode] = React.useState('signup')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [agree, setAgree] = React.useState(false)
  const [error, setError] = React.useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'signup') {
      if (!name.trim()) return setError('Please enter your name.')
      if (!email.trim()) return setError('Please enter your email.')
      if (!password.trim()) return setError('Please enter a password.')
      if (!agree) return setError('Please agree to the terms.')

      try {
        const raw = localStorage.getItem('users') || '[]'
        const users = JSON.parse(raw)
        if (users.find((u) => u.email === email.trim().toLowerCase())) {
          return setError('Email already registered. Try logging in.')
        }
        const user = {
          id: `u-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        }
        users.push(user)
        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('auth', JSON.stringify({ email: user.email }))
        navigate('/')
      } catch (err) {
        setError('Could not complete signup. Please try again.')
      }
    } else {
      if (!email.trim() || !password.trim()) {
        return setError('Please enter email and password.')
      }
      try {
        const raw = localStorage.getItem('users') || '[]'
        const users = JSON.parse(raw)
        const user = users.find(
          (u) => u.email === email.trim().toLowerCase() && u.password === password
        )
        if (!user) return setError('Invalid credentials. Please try again.')
        localStorage.setItem('auth', JSON.stringify({ email: user.email }))
        navigate('/')
      } catch (err) {
        setError('Could not log in. Please try again.')
      }
    }
  }

  return (
    <section className="ls-page" aria-label="Login or Signup">
      <div className="ls-card">
        <h2 className="ls-card-title">{mode === 'signup' ? 'Sign Up' : 'Login'}</h2>

        <form className="ls-card-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <input
              className="ls-input"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            className="ls-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="ls-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          <button type="submit" className="ls-btn-red">
            Continue
          </button>

          <p className="ls-switch">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="ls-link"
                  onClick={() => setMode('login')}
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                New user?{' '}
                <button
                  type="button"
                  className="ls-link"
                  onClick={() => setMode('signup')}
                >
                  Sign up here
                </button>
              </>
            )}
          </p>

          {mode === 'signup' && (
            <label className="ls-agree">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                By continuing, I agree to the terms of use & privacy policy.
              </span>
            </label>
          )}

          {error && <div className="ls-error" role="alert">{error}</div>}
        </form>
      </div>
    </section>
  )
}

export default LoginSignup