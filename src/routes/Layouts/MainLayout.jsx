import React from 'react'
import './MainLayout.css'
import TopBar from '../../components/TopBar/TopBar'
// import Gallery from '../../components/Gallery/Gallery'
import LeftBar from '../../components/leftBar/leftBar'
import { Outlet } from 'react-router'

function MainLayout() {
  return (
    <div className='app'>
      <LeftBar />
      <div className="content">
        <TopBar />
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout