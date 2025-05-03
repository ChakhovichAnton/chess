import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from './pages/specialPages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import ChessGamePage from './pages/ChessGamePage'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import DefaultLayout from './components/Layouts/DefaultLayout'
import GameLayout from './components/Layouts/GameLayout'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <LandingPage />
            </DefaultLayout>
          }
        />
        <Route
          path="/game/:id"
          element={
            <ProtectedRoute>
              <GameLayout>
                <ChessGamePage />
              </GameLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <DefaultLayout>
              <Login />
            </DefaultLayout>
          }
        />
        <Route
          path="/register"
          element={
            <DefaultLayout>
              <Register />
            </DefaultLayout>
          }
        />
        <Route
          path="*"
          element={
            <DefaultLayout>
              <NotFound />
            </DefaultLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
