// src/App.jsx
import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Line } from '@react-three/drei'
import * as THREE from 'three'
import Continents from './assets/Continents' // ← подключаем

const routeCoords = [
  [0, 51.5], [2.35, 48.85], [7.26, 43.7], [31.23, 30.05], [55.3, 25.27],
  [67.01, 24.86], [78.48, 17.38], [106.83, -6.2], [120.96, 14.6], [121.5, 31.2],
  [139.76, 35.68], [-122.42, 37.77], [-74, 40.7], [-3.7, 40.42], [0, 51.5]
]

function convertCoordsToVec3(lon, lat, radius = 2) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  ]
}

function interpolatePointsHandlingAntimeridian(points, segments = 40) {
  const interpolated = []

  for (let i = 0; i < points.length - 1; i++) {
    let [lon1, lat1] = points[i]
    let [lon2, lat2] = points[i + 1]
    let delta = lon2 - lon1

    if (Math.abs(delta) > 180) {
      if (delta > 0) lon2 -= 360
      else lon2 += 360
    }

    for (let j = 0; j < segments; j++) {
      const t = j / segments
      let lon = lon1 + (lon2 - lon1) * t
      let lat = lat1 + (lat2 - lat1) * t

      lon = ((lon + 180) % 360) - 180
      interpolated.push([lon, lat])
    }
  }

  interpolated.push(points[points.length - 1])
  return interpolated
}

function RouteLine() {
  const smoothPoints = useMemo(() => {
    const interpolated = interpolatePointsHandlingAntimeridian(routeCoords, 40)
    return interpolated.map(([lon, lat]) =>
      new THREE.Vector3(...convertCoordsToVec3(lon, lat))
    )
  }, [])

  return (
    <Line
      points={smoothPoints}
      color="red"
      lineWidth={2}
      dashed={false}
    />
  )
}

function Globe() {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={new THREE.TextureLoader().load(
          'https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-dashboard-pro/assets/img/earth.jpg'
        )}
      />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <OrbitControls />
      <Stars />
      <Globe />
      <Continents /> {/* ← добавлено здесь */}
      <RouteLine />
    </Canvas>
  )
}
