import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MorphingPoints } from '../components/ThreeDScene'

function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Contact Me</h1>
      
      {/* 3D Scene */}
      <div className="w-full h-[400px] mb-8">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ alpha: true, antialias: true }}
        >
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <MorphingPoints />
        </Canvas>
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