import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from './components/NotFound'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { LOCAL_STORAGE_ACCESS_TOKEN } from './constants'
import Game from './components/Game'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'

const App = () => {
  const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/game/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Game />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
