import React from 'react'
import { Link } from 'react-router-dom'

const Complaint = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-4xl font-bold mb-4">Complaint using</h1>
        <div className="flex items-center">
      <Link to={'/manualComplaint'} className="bg-white text-black py-2 px-4 rounded-lg mr-2">
        Manual Complaint
      </Link>
      <Link to={'/complaintbyimage'} className="bg-white text-black py-2 px-4 rounded-lg mr-2">
        Image
      </Link>
      <Link className="bg-white text-black py-2 px-4 rounded-lg">
        Video
      </Link>
      </div>
    </div>
  )
}

export default Complaint
