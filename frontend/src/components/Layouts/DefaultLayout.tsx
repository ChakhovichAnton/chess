import { FC, PropsWithChildren } from 'react'
import Footer from '../Footer'
import Navbar from '../navbar/Navbar'

const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-2 bg-background-gray min-h-screen h-full">
        {children}
      </main>
      <Footer />
    </>
  )
}

export default DefaultLayout
