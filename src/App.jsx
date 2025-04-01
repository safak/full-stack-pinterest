import './app.css'
import Gallery from './components/Gallery/Gallery'
// import LeftBar from './components/LeftBar/LeftBar'
import LeftBar from './components/leftBar/leftBar'
import TopBar from './components/TopBar/TopBar'

const App = () => {
  return (
    <div className='app'>
      <LeftBar />
      <div className="content">
        <TopBar />
        <Gallery />
      </div>
    </div>
  )
}

export default App