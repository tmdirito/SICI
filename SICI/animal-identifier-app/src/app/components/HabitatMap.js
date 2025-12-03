"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Earth 3D model
function EarthModel() {
  const gltf = useLoader(GLTFLoader, "/models/earth.glb");
  const texture = useLoader(THREE.TextureLoader, "/images/earthMaterial.jpeg");

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({ map: texture });
      child.material.side = THREE.DoubleSide;
    }
  });

  gltf.scene.rotation.x = Math.PI;
  return <primitive object={gltf.scene} scale={1.5} position={[0, 0, 0]} />;
}

// Convert lat/lon to 3D coordinates
function latLonToVector3(lat, lon, radius = 1.5) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Species points
function SpeciesPoints({ species, setHovered }) {
  return species.map((s, i) => {
    const pos = latLonToVector3(s.lat, s.lon);
    return (
      <mesh
        key={i}
        position={pos}
        onPointerOver={() => setHovered(i)}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#ff5722" />
      </mesh>
    );
  });
}

// Tooltip
function Tooltip({ species, hoveredIndex }) {
  if (hoveredIndex === null) return null;

  const s = species[hoveredIndex];
  const pos = latLonToVector3(s.lat, s.lon);

  return (
    <Html position={pos} distanceFactor={4} occlude={false}>
      <div
        style={{
          background: "rgba(0,0,0,0.8)",
          padding: "8px 12px",
          borderRadius: "50px",
          color: "#00ff88",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          minWidth: "120px",
        }}
      >
        <img
          src={s.img}
          alt={s.name}
          style={{ width: "36px", height: "36px", borderRadius: "50%" }}
        />
        <div>
          <div style={{ fontWeight: "bold" }}>{s.name}</div>
          <div>Count: {s.count}</div>
        </div>
      </div>
    </Html>
  );
}

export default function HabitatSection() {
  const orbitRef = useRef();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const species = [
    { name: "Amur Leopard", lat: 45, lon: 135, count: 120, status: "Critically Endangered", img: "/images/amur_leopard.jpg" },
    { name: "Hawksbill Turtle", lat: 15, lon: -70, count: 8000, status: "Critically Endangered", img: "/images/turtle.jpg" },
    { name: "Sumatran Orangutan", lat: -0.5, lon: 101, count: 14000, status: "Endangered", img: "/images/Sumatran.avif" },
    { name: "Black Rhino", lat: -15, lon: 25, count: 5500, status: "Critically Endangered", img: "/images/blackRhino.avif" },
    { name: "Vaquita", lat: 31, lon: -114, count: 20, status: "Critically Endangered", img: "/images/vaquita.webp" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3rem" }}>
      {/* Circular 3D Model Container */}
      <div
        style={{
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid #00ffb3",
          boxShadow: "0 0 30px rgba(0,255,179,0.4)",
          position: "relative",
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, 5, -5]} intensity={0.8} />

          <Suspense fallback={null}>
            <EarthModel />
            <SpeciesPoints species={species} setHovered={setHoveredIndex} />
            <Tooltip species={species} hoveredIndex={hoveredIndex} />
          </Suspense>

          <OrbitControls ref={orbitRef} enablePan={false} enableZoom zoomSpeed={0.3} />
        </Canvas>
      </div>

      {/* Vertical Line Connector */}
      <div
        style={{
          width: "3px",
          height: "100px",
          background: "linear-gradient(180deg, #00ffb3, #009f6b)",
          marginTop: "-4px",
        }}
      ></div>

      {/* Table Section */}
      <div
        style={{
          background: "rgba(0, 20, 15, 0.9)",
          borderRadius: "12px",
          padding: "1.5rem 2rem",
          color: "#e3fff5",
          boxShadow: "0 0 20px rgba(0,255,179,0.2)",
          width: "80%",
          maxWidth: "900px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#00ffb3", marginBottom: "1rem" }}>
          Endangered Species Data
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #00ffb3" }}>
              <th style={{ padding: "10px" }}>Species</th>
              <th style={{ padding: "10px" }}>Status</th>
              <th style={{ padding: "10px" }}>Count Left</th>
              <th style={{ padding: "10px" }}>Region</th>
            </tr>
          </thead>
          <tbody>
            {species.map((s, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: "1px solid rgba(0,255,179,0.2)",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,255,179,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={s.img}
                    alt={s.name}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      objectPosition: "center",
                      flexShrink: 0,
                      border: "2px solid #00ffb3",
                      boxShadow: "0 0 6px rgba(0,255,179,0.3)",
                    }}
                  />
                  {s.name}
                </td>
                <td style={{ padding: "10px", color: s.status === "Critically Endangered" ? "#ff4c4c" : "#ffaa00" }}>
                  {s.status}
                </td>
                <td style={{ padding: "10px" }}>{s.count.toLocaleString()}</td>
                <td style={{ padding: "10px" }}>
                  Lat {s.lat}°, Lon {s.lon}°
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}