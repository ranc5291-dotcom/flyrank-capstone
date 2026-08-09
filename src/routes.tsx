import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Favorites from './pages/Favorites'
import AddPrompt from './pages/AddPrompt'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Collections from './pages/Collections'
import Imported from './pages/Imported'
import Health from './pages/Health'
import { Playground } from './playground/Playground'
import AIWorkspace from './pages/AIWorkspace'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="library" element={<Library />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="add" element={<AddPrompt />} />
        <Route path="collections" element={<Collections />} />
        <Route path="imported" element={<Imported />} />
        <Route path="settings" element={<Settings />} />
        <Route path="health" element={<Health />} />
        <Route path="playground" element={<Playground />} />
        <Route path="ai-workspace" element={<AIWorkspace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}