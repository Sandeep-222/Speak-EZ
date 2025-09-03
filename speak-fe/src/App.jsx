import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import Layout from './components/Layout'
import Dashboard from './pages/DashBoard'
import AiInterviewPage from './pages/AiInterviewPage'
import WrittenTestPage from './pages/WrittenTestPage'
import SpeakTest from './pages/SpeakTestPage'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import InterviewQuesPage from './pages/InterviewQuesPage'
import ProtectedRoute from './auth/ProtectedRoute'

function Logout() {
  localStorage.removeItem('token')
  return <Navigate to="/login" />
}

function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/logout' element={<Logout />} />
          
          <Route path='/' element={<ProtectedRoute> <Layout /> </ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path='ai-interview' element={<AiInterviewPage />} />
            <Route path='questions' element={<InterviewQuesPage />} />
            <Route path='written-test' element={<WrittenTestPage />} />
            <Route path='speak-test' element={<SpeakTest />} />
          </Route>

        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </>
  )
}

export default App
