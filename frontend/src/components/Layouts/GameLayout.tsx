import { FC, PropsWithChildren } from 'react'
import Navbar from '../navbar/Navbar'

const GameLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-22 pb-2 bg-background-gray h-full min-h-screen">
        {children}
      </main>
    </>
  )
}

export default GameLayout
