import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from './components/NotFound'
import Login from './components/Login'
import Register from './components/Register'
import Chessboard from './components/Chessboard'
import ProtectedRoute from './components/ProtectedRoute'
import { LOCAL_STORAGE_ACCESS_TOKEN } from './constants'

const App = () => {
  const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Chessboard />
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
