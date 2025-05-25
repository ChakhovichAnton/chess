import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from './pages/specialPages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import ChessGamePage from './pages/ChessGamePage'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import DefaultLayout from './components/layouts/DefaultLayout'
import GameLayout from './components/layouts/GameLayout'
import { NotificationProvider } from './contexts/NotificationContext'

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
                <NotificationProvider>
                  <ChessGamePage />
                </NotificationProvider>
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
