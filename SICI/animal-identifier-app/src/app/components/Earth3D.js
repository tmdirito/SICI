"use client";

import { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import styles from "./HabitatMap.module.css";

function EarthModel() {
  const gltf = useLoader(GLTFLoader, "/models/earth.glb");
  const texture = useLoader(THREE.TextureLoader, "/images/earthMaterial.jpeg");

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({ map: texture });
      child.material.side = THREE.DoubleSide;
      child.material.needsUpdate = true;
    }
  });

  gltf.scene.rotation.x = Math.PI;
  gltf.scene.rotation.y = 0;
  gltf.scene.rotation.z = 0;

  return <primitive object={gltf.scene} scale={1.5} position={[0, 0, 0]} />;
}

function EarthLabels() {
  const species = [
    { name: "Dodo", lat: -20.3, lon: 57.6 },
    { name: "Woolly Mammoth", lat: 60, lon: 100 },
    { name: "Tasmanian Tiger", lat: -42.9, lon: 147.3 },
  ];

  function latLonToVector3(lat, lon, radius = 1.5) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return [x, y, z];
  }

  return species.map((s, i) => (
    <Html key={i} position={latLonToVector3(s.lat, s.lon)}>
      <div className="species-label">{s.name}</div>
    </Html>
  ));
}

export default function HabitatSection() {
  return (
    <section className={styles.habitatSection}>
      <h2 className={styles.heading}>Explore the Habitat</h2>
      <div className={styles.canvasWrapper}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, 5, -5]} intensity={0.8} />

          <Suspense fallback={null}>
            <EarthModel />
            <EarthLabels />
          </Suspense>

          <OrbitControls enablePan={false} enableZoom={true} zoomSpeed={0.3} />
        </Canvas>
      </div>
    </section>
  );
}