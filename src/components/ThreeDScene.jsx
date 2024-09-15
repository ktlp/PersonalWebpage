import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useTheme } from 'next-themes'
import * as THREE from 'three'
import SimplexNoise from 'simplex-noise'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { useLoader } from '@react-three/fiber'

const POINTS_COUNT = 1000
const SPHERE_RADIUS = 1
const TORUS_RADIUS = 3
const TUBE_RADIUS = 1
const STATIONARY_TIME = 3 // seconds
const TRANSITION_TIME = 0.5 // seconds
const CYCLE_TIME = STATIONARY_TIME * 2 + TRANSITION_TIME * 2
const simplex = new SimplexNoise('seed');



function generateRandomNumbers(count) {
  return Array.from({ length: count }, () => Math.random());
}


function useGeometryPositions() {
  const [meshA, meshB] = useLoader(STLLoader, ['/mail.stl', '/phone.stl'])

  return useMemo(() => {
    const posA = new Float32Array(POINTS_COUNT * 3)
    const posB = new Float32Array(POINTS_COUNT * 3)

    const tempPosition = new THREE.Vector3()

    for (let i = 0; i < POINTS_COUNT; i++) {
      // Mesh A positions
      const faceIndexA = Math.floor(Math.random() * meshA.attributes.position.count / 3)
      tempPosition.fromBufferAttribute(meshA.attributes.position, faceIndexA * 3)
      posA.set([tempPosition.x, tempPosition.y, tempPosition.z], i * 3)

      // Mesh B positions
      const faceIndexB = Math.floor(Math.random() * meshB.attributes.position.count / 3)
      tempPosition.fromBufferAttribute(meshB.attributes.position, faceIndexB * 3)
      posB.set([tempPosition.x, tempPosition.y, tempPosition.z], i * 3)
    }

    return { positionsA: posA, positionsB: posB }
  }, [meshA, meshB])
}


function useMorphingAnimation(positionsA, positionsB, offsets) {
  const [currentPositions, setCurrentPositions] = useState(null)

  useEffect(() => {
    setCurrentPositions(new Float32Array(positionsA))
  }, [positionsA])

  const updatePositions = useCallback((elapsedTime) => {
    if (!currentPositions) return null

    const newPositions = new Float32Array(currentPositions)
    const cycleProgress = (elapsedTime % CYCLE_TIME) / CYCLE_TIME

    let progress, morphState

    if (cycleProgress < STATIONARY_TIME / CYCLE_TIME) {
      morphState = 'A'
      progress = 0
    } else if (cycleProgress < (STATIONARY_TIME + TRANSITION_TIME) / CYCLE_TIME) {
      morphState = 'AtoB'
      progress = (cycleProgress - STATIONARY_TIME / CYCLE_TIME) / (TRANSITION_TIME / CYCLE_TIME)
    } else if (cycleProgress < (STATIONARY_TIME * 2 + TRANSITION_TIME) / CYCLE_TIME) {
      morphState = 'B'
      progress = 1
    } else {
      morphState = 'BtoA'
      progress = 1 - (cycleProgress - (STATIONARY_TIME * 2 + TRANSITION_TIME) / CYCLE_TIME) / (TRANSITION_TIME / CYCLE_TIME)
    }

    for (let i = 0; i < POINTS_COUNT; i++) {
      const i3 = i * 3
      const noise = SPHERE_RADIUS*0.05*simplex.noise4D(0.5*elapsedTime, i, 1, 1)
      const noise2 = SPHERE_RADIUS*0.05*simplex.noise4D(0.5*elapsedTime, i, 2, 1)
      const noise3 = SPHERE_RADIUS*0.05*simplex.noise4D(0.5*elapsedTime, i, 1, 2)
      if (morphState === 'A' || morphState === 'AtoB') {
        if (progress === 0) {
          newPositions[i3] = positionsA[i3] + noise
          newPositions[i3 + 1] = positionsA[i3 + 1] + noise2
          newPositions[i3 + 2] = positionsA[i3 + 2] + noise3
        }else{
          for (let j = 0; j < 3; j++) {
            newPositions[i3 + j] = positionsA[i3 + j] + (positionsB[i3 + j] - positionsA[i3 + j]) * progress
          }
        }
      } else {
        if (progress === 1){ 
          newPositions[i3] = positionsB[i3] + noise
          newPositions[i3 + 1] = positionsB[i3 + 1] + noise2
          newPositions[i3 + 2] = positionsB[i3 + 2] + noise3

        }
        else{
          for (let j = 0; j < 3; j++) {
            newPositions[i3 + j] = positionsB[i3 + j] + (positionsA[i3 + j] - positionsB[i3 + j]) * (1 - progress)
        }
      }
      }
    }

    return newPositions
  }, [currentPositions, positionsA, positionsB])

  return [currentPositions, updatePositions, setCurrentPositions]
}

function MorphingPoints() {
  const pointsRef = useRef()
  const { theme } = useTheme()
  const { positionsA, positionsB } = useGeometryPositions()
  const offsets = generateRandomNumbers(POINTS_COUNT)
  const [currentPositions, updatePositions, setCurrentPositions] = useMorphingAnimation(positionsA, positionsB, offsets)

  useFrame(({ clock }) => {
    if (pointsRef.current && currentPositions) {
      const newPositions = updatePositions(clock.getElapsedTime())
      if (newPositions) {
        setCurrentPositions(newPositions)
        pointsRef.current.geometry.attributes.position.array = newPositions
        pointsRef.current.geometry.attributes.position.needsUpdate = true
      }
    }
  })

  if (!currentPositions) return null

  return (
    <Points ref={pointsRef} positions={currentPositions} stride={3}>
      <PointMaterial 
        transparent 
        color={theme === 'dark' ? "#ffffff" : "#000000"} 
        size={0.05} 
        sizeAttenuation 
        depthWrite={false} 
      />
    </Points>
  )
}

function ThreeDScene() {
  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
        gl={{ alpha: true, antialias: true }}
      >
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <MorphingPoints />
      </Canvas>
    </div>
  )
}

export { MorphingPoints }
export default ThreeDScene