import { FaChessKing, FaGithub } from 'react-icons/fa6'
import { useAuth } from '../../context/auth'
import NavbarButton from './NavbarButton'
import NavbarLink from './NavbarLink'
import MobileNavbarMenu from './MobileNavbarMenu'

const Navbar = () => {
  const { user, loading, logout } = useAuth()

  return (
    <nav className="fixed bg-white flex justify-center w-full z-10 px-2 h-20 font-semibold">
      <div className="flex justify-between items-center max-w-6xl w-full">
        <a href="/" className="flex items-center gap-2 text-3xl">
          <FaChessKing size={28} className="shrink-0" /> Online Chess
        </a>
        <MobileNavbarMenu />
        <div className="hidden xs:flex gap-3 sm:gap-10 items-center">
          {user ? (
            <>
              <NavbarLink href="/profile" text="Profile" />
              <NavbarButton onClick={logout} disabled={loading} text="Logout" />
            </>
          ) : (
            <>
              <NavbarLink href="/login" text="Log In" />
              <NavbarLink href="/register" text="Sign Up" />
            </>
          )}
          <a href="https://github.com/ChakhovichAnton/chess" target="_blank">
            <FaGithub size={20} className="shrink-0" />
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
