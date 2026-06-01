import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import RoastView from './pages/RoastView'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/results/:username" element={<Results />} />
      <Route path="/roast/:id" element={<RoastView />} />
    </Routes>
  )
}
