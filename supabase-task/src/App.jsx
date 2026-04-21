import { AuthProvider, useAuth } from './lib/AuthContext'
import AuthPage from './components/auth/AuthPage'
import Notes from './components/dashboard/Notes'
import RealtimeChat from './components/realtime/RealtimeChat'
import FileStorage from './components/storage/FileStorage'
import "./App.css";

function AppContent() {
  const { user } = useAuth()

  return (
    <div>
      {user ? (
        <>
          <Notes />
          <RealtimeChat />
          <FileStorage />
        </>
      ) : (
        <AuthPage />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
