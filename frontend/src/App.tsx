import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from './components/specialPages/NotFound'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { LOCAL_STORAGE_ACCESS_TOKEN } from './constants'
import ChessGame from './components/chessGame/ChessGame'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'

const App = () => {
  const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)

  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-10 mb-2">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/game/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ChessGame />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
