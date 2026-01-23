import { Outlet, useNavigate } from 'react-router';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import useAuthStore from '@/lib/authStore';
import { useEffect } from 'react';


function AuthLayout() {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);
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
