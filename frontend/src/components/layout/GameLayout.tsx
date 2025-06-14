import { FC, PropsWithChildren } from 'react'
import Navbar from '../navbar/Navbar'

const GameLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-22 pb-2 bg-gradient-to-br from-gray-900 to-gray-800 h-full min-h-screen flex">
        {children}
      </main>
    </>
  )
}

export default GameLayout
