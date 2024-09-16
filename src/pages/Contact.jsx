import React from 'react'
import ThreeDScene from '../components/ThreeDScene'

function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Contact Me</h1>
      
      {/* 3D Scene */}
      <div className="w-full h-[400px] mb-8">
        <ThreeDScene />
      </div>

      {/* Contact form or information */}
      <div className="w-full max-w-md">
        <p className="text-center mb-4">
          You can reach me at: example@email.com
        </p>
        {/* Add more contact information or a form here */}
      </div>
    </div>
  )
}

export default Contact