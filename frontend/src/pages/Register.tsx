import { useRef, useState } from 'react'
import axios from 'axios'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import AuthSubmit from '../components/auth/AuthSubmit'
import AuthError from '../components/auth/AuthError'
import { passwordIsValid, usernameIsValid } from '../utils/validators/userData'
import api from '../utils/axios'
import { ERROR_REMOVAL_TIME_MS } from '../constants'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmationPassword] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const errorTimeout = useRef<number | undefined>(undefined)
  const [status, setStatus] = useState<'input' | 'loading' | 'success'>('input')

  const clearError = () => {
    if (error) setError(undefined)
    if (errorTimeout.current !== undefined) clearTimeout(errorTimeout.current)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      // Clear error after some time
      errorTimeout.current = setTimeout(
        () => setError(undefined),
        ERROR_REMOVAL_TIME_MS,
      )
      return
    } else if (!usernameIsValid(username)) {
      setError('Username must be at least 3 characters long')
      // Clear error after some time
      errorTimeout.current = setTimeout(
        () => setError(undefined),
        ERROR_REMOVAL_TIME_MS,
      )
      return
    } else if (!passwordIsValid(password)) {
      setError('Password must be at least 3 characters long')
      // Clear error after some time
      errorTimeout.current = setTimeout(
        () => setError(undefined),
        ERROR_REMOVAL_TIME_MS,
      )
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

      // Clear error after some time
      errorTimeout.current = setTimeout(
        () => setError(undefined),
        ERROR_REMOVAL_TIME_MS,
      )

      setStatus('input')
    }
  }

  return (
    <AuthLayout title="Sign Up">
      {status === 'success' ? (
        <div>
          <p>Registration was succesful</p>
          <a href="/login">Login</a>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            onChange={clearError}
            className="flex flex-col gap-8"
          >
            <AuthInput
              label="Username"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username"
              disabled={status === 'loading'}
            />
            <AuthInput
              label="Password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              type="password"
              disabled={status === 'loading'}
            />
            <AuthInput
              label="Confirm password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(event) => setConfirmationPassword(event.target.value)}
              placeholder="Confirm password"
              type="password"
              disabled={status === 'loading'}
            />
            <AuthSubmit
              text={status === 'loading' ? 'Loading...' : 'Sign Up'}
              disabled={status === 'loading'}
            />
          </form>
          <AuthError error={error} />

          <p>
            Already have an account?{' '}
            <a href="/login" className="underline">
              Login
            </a>
          </p>
        </>
      )}
    </AuthLayout>
  )
}

export default Register
