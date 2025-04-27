import { FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="w-full flex justify-center bg-background-gray-light py-6 text-center text-sm text-white">
      <div className="max-w-6xl flex justify-center">
        <a
          href="https://github.com/ChakhovichAnton/chess"
          target="_blank"
          className="flex items-center gap-2 hover:text-blue-200"
        >
          <FaGithub />
          GitHub
        </a>
      </div>
    </footer>
  )
}

export default Footer
