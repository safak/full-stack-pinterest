import './app.css'

const App = () => {
  return (
    <div className='app'>
      <LeftBar/>
      <div className='content'>
        <TopBar/>
        <Gallery/>
      </div>
    </div>
  )
}

export default App