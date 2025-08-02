import { useMemo } from 'react'
import * as THREE from 'three'
import geojson from './Continents.json'

function convertCoordsToVec3(lon, lat, radius = 2.001) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  )
}

export default function Continents() {
  const lines = useMemo(() => {
    const result = []
    for (const feature of geojson.features) {
      const { type, coordinates } = feature.geometry || {}
      if (!coordinates) continue

      if (type === 'Polygon') {
        for (const ring of coordinates) {
          result.push(ring.map(([lon, lat]) => convertCoordsToVec3(lon, lat)))
        }
      } else if (type === 'MultiPolygon') {
        for (const polygon of coordinates) {
          for (const ring of polygon) {
            result.push(ring.map(([lon, lat]) => convertCoordsToVec3(lon, lat)))
          }
        }
      }
    }
    return result
  }, [])

  return (
    <group>
     {lines.map((points, i) => (
  <line key={i}>
    <primitive
      object={new THREE.BufferGeometry().setFromPoints(points)}
      attach="geometry"
    />
    <primitive
      object={new THREE.LineBasicMaterial({ color: 'gray', linewidth: 0.5 })}
      attach="material"
    />
  </line>
))}
    </group>
  )
}
