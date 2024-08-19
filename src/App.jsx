import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ViewComplaints from './components/viewComplaint/viewComplaints'
import JourneyDetails from './components/journeyDetails/JourneyDetails'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Complaint from './components/complaintFeatures/Complaint'
import ComplaintByImage from './components/complaintFeatures/ComplaintByImage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Complaint />} />
        <Route path='/complaintbyimage' element={<ComplaintByImage />} />
        <Route path='/viewComplaints' element={<ViewComplaints />} />
        <Route path='/Manualcomplaint' element={<JourneyDetails />} />
      </Routes>
    </Router>
  )
}

export default App
