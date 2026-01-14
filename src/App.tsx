import Gallery from './components/gallery/Gallery';
import PublicNavbar from './components/navbar/PublicNavbar'
import AppSidebar from './components/sidebar/Sidebar'
import Topbar from './components/topBar/Topbar';
import { SidebarProvider } from './components/ui/sidebar'

function App() {
  const isUserLoggedIn = true;
  return (
    <>
      <div className='w-full h-screen flex'>
        {isUserLoggedIn && (
          <div className='flex'>
            <SidebarProvider defaultOpen={true} className='border-2 max-w-18'>
              <AppSidebar />
            </SidebarProvider>
          </div>
        )}
        <div className='flex-1'>
          {isUserLoggedIn ? <Topbar /> : <PublicNavbar />}
          <Gallery />
        </div>
      </div>
    </>
  )
}

export default App
