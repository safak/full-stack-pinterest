import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route , Routes } from "react-router";
import './index.css'
import App from './App.jsx'
import HomePage from './routes/HomePage/HomePage.jsx';
import CreatePage from './routes/CreatePage/CreatePage.jsx';
import PostPage from './routes/PostPage/PostPage.jsx';
import AuthPage from './routes/AuthPage/AuthPage.jsx';
import ProfilePage from './routes/ProfilePage/ProfilePage.jsx';
import SearchPage from './routes/SearchPage/SearchPage.jsx';
import MainLayout from './routes/Layouts/MainLayout.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />} >
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/pin/:id" element={<PostPage />} />
          
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
      </Route>
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  </BrowserRouter>
  </StrictMode>,
)
