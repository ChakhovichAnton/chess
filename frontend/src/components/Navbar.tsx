import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed bg-slate-100 flex justify-center w-full z-1 px-2 py-2">
      <ul className="flex justify-between max-w-6xl w-full gap-10 font-semibold">
        <li className="flex flex-1 justify-start">
          <a href="/">Home</a>
        </li>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>
              <button className="hover:cursor-pointer" onClick={logout}>
                Logout
              </button>
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
