import { Outlet } from 'react-router';

import AppSidebar from '@/components/sidebar/Sidebar';
import Topbar from '@/components/topBar/Topbar';
import { SidebarProvider } from '@/components/ui/sidebar';


function MainLayout() {
  return (
    <div className='w-full h-screen flex'>
      <div className='flex'>
        <SidebarProvider defaultOpen={true} className='border-2 max-w-18'>
          <AppSidebar />
        </SidebarProvider>
      </div>
      <div className='flex-1'>
        <Topbar />
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
