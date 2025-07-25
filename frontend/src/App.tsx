import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from './pages/specialPages/NotFound'
import ProtectedRoute from './pages/wrappers/ProtectedRoute'
import ChessGameWrapper from './pages/wrappers/ChessGameWrapper'
import ChessGamePage from './pages/ChessGamePage'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import DefaultLayout from './components/layout/DefaultLayout'
import GameLayout from './components/layout/GameLayout'
import { NotificationProvider } from './context/notification'
import { DialogProvider } from './context/dialog'
import ProfilePage from './pages/ProfilePage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <ChessGameWrapper userFrom="auth">
                <LandingPage />
              </ChessGameWrapper>
            </DefaultLayout>
          }
        />
        <Route
          path="/game/:id"
          element={
            <ProtectedRoute>
              <GameLayout>
                <NotificationProvider>
                  <DialogProvider>
                    <ChessGamePage />
                  </DialogProvider>
                </NotificationProvider>
              </GameLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <DefaultLayout>
              <ChessGameWrapper userFrom="params">
                <ProfilePage />
              </ChessGameWrapper>
            </DefaultLayout>
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
