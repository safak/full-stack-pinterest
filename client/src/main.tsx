import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router";
import './index.css';

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import AuthLayout from './routes/layouts/AuthLayout.tsx';
import MainLayout from './routes/layouts/MainLayout.tsx';

const queryClient = new QueryClient()

const Homepage = React.lazy(() => import('./routes/homePage/Homepage'));
const AuthPage = React.lazy(() => import('./routes/auth/AuthPage'));
const CreatePage = React.lazy(() => import('./routes/createPage/CreatePage'));
const PostPage = React.lazy(() => import('./routes/postPage/PostPage'));
const ProfilePage = React.lazy(() => import('./routes/profilePage/ProfilePage'));
const EditProfilePage = React.lazy(() => import('./routes/editProfilePage/EditProfilePage'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/pin/:id" element={<PostPage />} />
            <Route path="/user/:id" element={<ProfilePage />} />
            <Route path="/user/edit/:id" element={<EditProfilePage />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<AuthPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
