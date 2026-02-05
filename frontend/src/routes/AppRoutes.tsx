import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProjectsPage from '../pages/ProjectsPage'
import TasksPage from '../pages/TasksPage'
import CalendarPage from '../pages/CalendarPage'
import NotificationsPage from '../pages/NotificationsPage'
import SettingsPage from '../pages/SettingsPage'
import AppLayout from '../components/layout/AppLayout'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/app"
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="projects/:id/tasks" element={<TasksPage />} />
      <Route path="projects/:id/calendar" element={<CalendarPage />} />
      <Route path="calendar" element={<CalendarPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="/" element={<Navigate to="/app/projects" replace />} />
    <Route path="*" element={<Navigate to="/app/projects" replace />} />
  </Routes>
)

export default AppRoutes
