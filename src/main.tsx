import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router";
import './index.css';

import CreatePage from './routes/createPage/CreatePage.tsx';
import Homepage from './routes/homePage/Homepage.tsx';
import PostPage from './routes/postPage/PostPage.tsx';
import ProfilePage from './routes/profilePage/ProfilePage.tsx';
import MainLayout from './routes/layouts/MainLayout.tsx';
import AuthLayout from './routes/layouts/AuthLayout.tsx';
import AuthPage from './routes/auth/AuthPage.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/pin/:id" element={<PostPage />} />
          <Route path="/user/:id" element={<ProfilePage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/auth" element={<AuthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
