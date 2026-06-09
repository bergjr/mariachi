import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import './App.css'
import Layout from './pages/Layout/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
