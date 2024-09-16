import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useTheme } from 'next-themes'
import * as THREE from 'three'
import SimplexNoise from 'simplex-noise'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, CameraShake } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { useLoader } from '@react-three/fiber'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

const POINTS_COUNT = 1800
const SPHERE_RADIUS = 1
const TORUS_RADIUS = 3
const TUBE_RADIUS = 1
const STATIONARY_TIME = 4 // seconds
const TRANSITION_TIME = 0.5 // seconds
const CYCLE_TIME = STATIONARY_TIME * 2 + TRANSITION_TIME * 2
const simplex = new SimplexNoise('seed');



function generateRandomNumbers(count) {
  return Array.from({ length: count }, () => Math.random());
}


function useGeometryPositions() {
  const [meshA, meshB] = useLoader(STLLoader, ['/at.stl', '/envelope.stl'])

  return useMemo(() => {
    const posA = new Float32Array(POINTS_COUNT * 3)
    const posB = new Float32Array(POINTS_COUNT * 3)

    const tempPosition = new THREE.Vector3()
    const tempNormal = new THREE.Vector3()

    // Create MeshSurfaceSamplers for both meshes
    const samplerA = new MeshSurfaceSampler(new THREE.Mesh(meshA)).build()
    const samplerB = new MeshSurfaceSampler(new THREE.Mesh(meshB)).build()

    for (let i = 0; i < POINTS_COUNT; i++) {
      // Sample points from Mesh A
      samplerA.sample(tempPosition, tempNormal)
      posA.set([tempPosition.x, tempPosition.y, tempPosition.z], i * 3)

      // Sample points from Mesh B
      samplerB.sample(tempPosition, tempNormal)
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
        size={0.2} 
        sizeAttenuation 
        depthWrite={false} 
      />
    </Points>
  )
}

function Camera() {
  return <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={35} zoom={2}  />
}

function Rig() {
  const [vec] = useState(() => new THREE.Vector3())
  const { camera, mouse } = useThree()
  useFrame(() => camera.position.lerp(vec.set(0, 0.0, 30), 0.45))
  return <CameraShake maxYaw={0.0210} maxPitch={0.0210} minPitch={-0.0210} maxRoll={0.0} yawFrequency={0.0510} pitchFrequency={0.0310} rollFrequency={0.0310} />
}

function ThreeDScene() {
  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Camera />
        {/* <OrbitControls makeDefault maxPolarAngle={Math.PI * 11/18} maxAzimuthAngle={Math.PI / 30} minAzimuthAngle={-Math.PI / 30} minPolarAngle={Math.PI * 7 / 18} maxZoom={10} enablePan={false}/> */}
        <OrbitControls enableZoom={false} enablePan={false}/>
        <ambientLight intensity={0.5} />
        <MorphingPoints />
        <Rig />
      </Canvas>
    </div>
  )
}

export { MorphingPoints }
export default ThreeDScene