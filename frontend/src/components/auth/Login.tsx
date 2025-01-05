import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const successOrError = await login(username, password)
    if (successOrError === true) {
      navigate('/', { replace: true })
    } else {
      setLoading(false)
      setError(successOrError)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          disabled={loading}
          required
        />
        <input
          value={password}
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          Login
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>No account?</p>
      <a href="/register">Register</a>
    </div>
  )
}

export default Login
