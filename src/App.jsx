import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout/Layout'
import Home from './pages/Home/Home'
import Flights from './pages/Flights/Flights'
import Hotels from './pages/Hotels/Hotels'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/hotels" element={<Hotels />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
