import { useState } from 'react'
import { useAuth } from '../../lib/AuthContext'

export default function AuthPage() {
  const { signUp, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (isSignUp) {
      const { error } = await signUp(email, password)
      if (error) setMessage(error.message)
      else setMessage('Check your email to confirm!')
    } else {
      const { error } = await signIn(email, password)
      if (error) setMessage(error.message)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '24px' }}>
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {message && <p>{message}</p>}

        <button type="submit">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have account? Sign In' : 'No account? Sign Up'}
      </button>
    </div>
  )
}