import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

const routeCoords = [
  [0, 51.5], [2.35, 48.85], [7.26, 43.7], [31.23, 30.05], [55.3, 25.27],
  [67.01, 24.86], [78.48, 17.38], [106.83, -6.2], [120.96, 14.6], [121.5, 31.2],
  [139.76, 35.68], [-122.42, 37.77], [-74, 40.7], [-3.7, 40.42], [0, 51.5]
];

function convertCoordsToVec3(lon, lat, radius = 2) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function Globe() {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={new THREE.TextureLoader().load('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-dashboard-pro/assets/img/earth.jpg')}
      />
    </mesh>
  );
}

function RouteLine() {
  const points = useMemo(() =>
    routeCoords.map(([lon, lat]) =>
      new THREE.Vector3(...convertCoordsToVec3(lon, lat))
    ), []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 100, 0.02, 8, false]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}


function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <OrbitControls />
      <Stars />
      <Globe />
      <RouteLine />
    </Canvas>
  );
}

export default App;
