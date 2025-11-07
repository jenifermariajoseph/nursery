import React from 'react'
import { useAuth } from '../context/auth'
import './loginsignup.css'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'

export default function LoginSignup() {
  const [mode, setMode] = React.useState('signup')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [agree, setAgree] = React.useState(false)
  const { login, register } = useAuth()
  const { refresh } = useCart()
  const navigate = useNavigate()
  const [msg, setMsg] = React.useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const sessionId = 'anon'
      if (mode === 'login') {
        await login(email, password, sessionId)
      } else {
        await register(email, password)
        await login(email, password, sessionId)
      }
      await refresh() // load user cart using the token
      navigate('/')   // redirect to Home
      setMsg('Signed in successfully')
      // Optional: after auth, navigate or refresh cart page
    } catch (err) {
      setMsg('Failed: ' + err.message)
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

          {msg && <div className="ls-error" role="alert">{msg}</div>}
        </form>
      </div>
    </section>
  )
}