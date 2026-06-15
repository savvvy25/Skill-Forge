import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import ProgressTracker from './pages/ProgressTracker/ProgressTracker';
import './App.css';

function App() {
  return (
    <AuthProvider>
      {/* Toast notification container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1f35',
            color: '#f1f5f9',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
            fontSize: '0.9rem',
            fontFamily: "'Inter', sans-serif",
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#1a1f35',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1a1f35',
            },
          },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — wrapped in Layout (Sidebar + Navbar) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/progress" element={<ProgressTracker />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
