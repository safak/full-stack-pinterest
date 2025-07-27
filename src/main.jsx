import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router"
import './index.css'
import Homepage from './routes/homepage/homepage'
import CreatePage from './routes/createPage/createPage'
import PostPage from './routes/postPage/postPage'
import ProfilePage from './routes/profilePage/profilePage'
import SearchPage from './routes/searchPage/searchPage'
import AuthPage from './routes/authPage/authPage'
import MainLayout from './routes/layouts/mainLayout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={ <Homepage />}/>
        <Route path='/create' element={ <CreatePage />}/>
        <Route path='/pin/:id' element={ <PostPage />}/>
        <Route path='/:username' element={ <ProfilePage />}/>
        <Route path='/search' element={ <SearchPage />}/>
      </Route>
      <Route path='/auth' element={<AuthPage/>}></Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
