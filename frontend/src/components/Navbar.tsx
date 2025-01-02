import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        {user ? (
          <>
            <li>Username: {user.username}</li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <a href="/login">Login</a>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
