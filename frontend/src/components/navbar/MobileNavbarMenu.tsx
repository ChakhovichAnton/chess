import { useState } from 'react'
import { FaGithub } from 'react-icons/fa6'
import { IoMenu, IoCloseSharp } from 'react-icons/io5'

const MobileNavbarMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleNavbar = () => setIsOpen((prev) => !prev)

  return (
    <>
      <button
        className="xs:hidden"
        onClick={toggleNavbar}
        aria-label="Toggle navbar"
      >
        {isOpen ? <IoCloseSharp size={40} /> : <IoMenu size={40} />}
      </button>

      <div
        className={`absolute flex flex-1 left-0 right-0 top-full bg-white shadow-md z-10 transform transition-all duration-300 ease-in-out md:hidden ${
          isOpen
            ? 'translate-y-0 opacity-100 border-y'
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <a href="/login" className="flex-1 justify-start py-4">
          <span className="flex justify-center">Login</span>
        </a>
        <a href="/register" className="flex-1 justify-center py-4">
          <span className="flex justify-center">Sign Up</span>
        </a>
        <a
          href="https://github.com/ChakhovichAnton/chess"
          target="_blank"
          className="flex-1 justify-end py-4"
        >
          <span className="flex justify-center gap-1 items-center">
            GitHub <FaGithub size={20} className="shrink-0" />
          </span>
        </a>
      </div>
    </>
  )
}

export default MobileNavbarMenu
