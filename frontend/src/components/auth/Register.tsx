import { useState } from 'react'
import axios from 'axios'
import api from '../../utils/axios'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmationPassword] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<'input' | 'loading' | 'success'>('input')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setStatus('loading')

    try {
      await api.post('/api/account/register/', { username, password })
      setStatus('success')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.error as string
        setError(errorMessage || 'Registration failed. Please try again.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }

      setStatus('input')
    }
  }

  return (
    <div>
      <h1>Register</h1>
      {status === 'success' ? (
        <div>
          <p>Registration was succesful</p>
          <a href="/login">Login</a>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username"
              required
              disabled={status === 'loading'}
            />
            <input
              value={password}
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              disabled={status === 'loading'}
              required
            />
            <input
              value={confirmPassword}
              type="password"
              onChange={(event) => setConfirmationPassword(event.target.value)}
              placeholder="Confirm password"
              disabled={status === 'loading'}
              required
            />
            <button type="submit" disabled={status === 'loading'}>
              Register
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <p>Already have an account?</p>
          <a href="/login">Login</a>
        </div>
      )}
    </div>
  )
}

export default Register
