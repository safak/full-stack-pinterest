import { Outlet } from 'react-router';
import PublicNavbar from '@/components/navbar/PublicNavbar';


function AuthLayout() {
  return (
    <>
      <div className='w-full h-screen flex'>
        <div className='flex-1 py-2 mx-4'>
          <PublicNavbar />
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default AuthLayout
