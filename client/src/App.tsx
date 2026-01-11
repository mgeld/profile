import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Profile from './components/Profile'



function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
