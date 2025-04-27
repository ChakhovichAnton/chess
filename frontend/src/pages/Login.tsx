import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ERROR_REMOVAL_TIME_MS } from '../constants'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import AuthSubmit from '../components/auth/AuthSubmit'
import AuthError from '../components/auth/AuthError'
import { useAuth } from '../contexts/AuthContext'


const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const errorTimeout = useRef<number | undefined>(undefined)

  const navigate = useNavigate()
  const { login } = useAuth()

  const clearError = () => {
    if (error) setError(undefined)
    if (errorTimeout.current !== undefined) clearTimeout(errorTimeout.current)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearError()
    setLoading(true)

    const successOrError = await login(username, password)
    if (successOrError === true) {
      navigate('/', { replace: true })
    } else {
      setLoading(false)
      setError(successOrError)

      // Clear error after some time
      errorTimeout.current = setTimeout(
        () => setError(undefined),
        ERROR_REMOVAL_TIME_MS,
      )
    }
  }

  return (
    <AuthLayout title="Login">
      <form
        onSubmit={handleSubmit}
        onChange={clearError}
        className="flex flex-col gap-8"
      >
        <AuthInput
          label="Username"
          id="username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value)
          }}
          placeholder="Username"
          disabled={loading}
        />
        <AuthInput
          label="Password"
          id="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
          }}
          type="password"
          placeholder="Password"
          disabled={loading}
        />
        <AuthSubmit
          text={loading ? 'Loading...' : 'Login'}
          disabled={loading}
        />
      </form>
      <AuthError error={error} />
      <p>
        No account?{' '}
        <a href="/register" className="underline">
          Sign Up
        </a>
      </p>
    </AuthLayout>
  )
}

export default Login
