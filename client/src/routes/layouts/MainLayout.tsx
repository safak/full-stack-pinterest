import { Outlet } from 'react-router';

import PublicNavbar from '@/components/navbar/PublicNavbar';
import AppSidebar from '@/components/sidebar/Sidebar';
import Topbar from '@/components/topBar/Topbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import useAuthStore from '@/lib/authStore';
import useSocketStore from '@/lib/socketStore';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { Toaster } from 'sonner';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function MainLayout() {
  const { currentUser } = useAuthStore();
  const { socket, setSocket } = useSocketStore();




  useEffect(() => {
    const socketIo = io(apiUrl, { withCredentials: true });
    setSocket(socketIo);
    console.log(socketIo);

    socketIo.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <div className='w-full h-screen flex'>
      <div className='flex'>
        <SidebarProvider defaultOpen={true} className='border-2 max-w-18'>
          <AppSidebar />
        </SidebarProvider>
      </div>
      <div className='flex-1'>
        {currentUser ? <Topbar /> : <PublicNavbar />}
        <Outlet />
      </div>
      <Toaster position='top-right' />
    </div>
  )
}

export default MainLayout
