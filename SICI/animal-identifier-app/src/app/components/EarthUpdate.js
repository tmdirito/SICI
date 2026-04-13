"use client";
import { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import styles from "./EarthUpdate.module.css";

export default function HabitatMap1() {
  const globeRef = useRef();
  const globeContainerRef = useRef();

  const [texture, setTexture] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [line, setLine] = useState(null);
  
  // NEW: State for responsive globe size
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 800 });

  const species = [
    {
      name: "Amur Leopard",
      status: "Critically Endangered",
      habitat: "Russia & China",
      population: "120–130",
      description: "One of the rarest big cats in the world, surviving in harsh cold climates and threatened by habitat loss.",
      lat: 45,
      lng: 135
    },
    {
      name: "Vaquita",
      status: "Critically Endangered",
      habitat: "Gulf of California",
      population: "≈20",
      description: "The rarest marine mammal on Earth, primarily threatened by illegal fishing nets.",
      lat: 31,
      lng: -114
    },
    {
      name: "Black Rhino",
      status: "Critically Endangered",
      habitat: "Southern Africa",
      population: "5,500",
      description: "A partially recovered species still facing major poaching threats.",
      lat: -15,
      lng: 25
    }
  ];

  // NEW: Listen for window resize to adjust globe dimensions
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 768) {
        setGlobeSize({ width: screenWidth - 40, height: screenWidth - 40 });
      } else if (screenWidth <= 1024) {
        setGlobeSize({ width: 500, height: 500 });
      } else {
        setGlobeSize({ width: 800, height: 800 });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Flip texture (fix upside down globe)
  useEffect(() => {
    const img = new Image();
    img.src = "/images/earthMaterial.jpeg";
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.translate(0, img.height);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, 0);

      setTexture(canvas.toDataURL("image/jpeg"));
    };
  }, []);

  // Auto rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex(prev => (prev + 1) % species.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Move camera & update line
  useEffect(() => {
    if (!globeRef.current) return;

    const selected = species[selectedIndex];

    globeRef.current.pointOfView(
      {
        lat: selected.lat,
        lng: selected.lng,
        altitude: 2
      },
      2000
    );

    // Hide the tracking line on mobile to prevent layout breaking
    if (window.innerWidth > 1024) {
      setTimeout(updateLine, 2100);
    } else {
      setLine(null);
    }
  }, [selectedIndex]);

  const updateLine = () => {
    if (!globeRef.current || !globeContainerRef.current) return;

    const selected = species[selectedIndex];

    const { x, y } = globeRef.current.getScreenCoords(
      selected.lat,
      selected.lng
    );

    const rect = globeContainerRef.current.getBoundingClientRect();

    setLine({
      x1: rect.left + x,
      y1: rect.top + y,
      x2: window.innerWidth * 0.28,
      y2: window.innerHeight * 0.5
    });
  };

  const selected = species[selectedIndex];

  if (!texture) return null;

  return (
    <div className={styles.wrapper}>
      {/* LEFT TEXT */}
      <div className={styles.info}>
        <h2>{selected.name}</h2>
        <div className={styles.divider}></div>

        <p><strong>Status:</strong> {selected.status}</p>
        <p><strong>Habitat:</strong> {selected.habitat}</p>
        <p><strong>Population:</strong> {selected.population}</p>
        <p className={styles.description}>{selected.description}</p>
      </div>

      {/* RIGHT GLOBE - Using dynamic sizing */}
      <div ref={globeContainerRef} className={styles.globeContainer}>
        <Globe
          ref={globeRef}
          width={globeSize.width}
          height={globeSize.height}
          globeImageUrl={texture}
          backgroundColor="rgba(0,0,0,0)"
          labelsData={species}
          labelLat={(d) => d.lat}
          labelLng={(d) => d.lng}
          labelText={(d) => d.name}
          labelSize={2}
          labelDotRadius={0.7}
          labelColor={() => "#ffffff"}
          labelAltitude={0.02}
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </div>

      {/* Animated Line */}
      {line && (
        <svg className={styles.svgLine}>
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#003366"
            strokeWidth="2"
            strokeDasharray="800"
            strokeDashoffset="800"
            style={{ animation: "drawLine 1s ease forwards" }}
          />
        </svg>
      )}
    </div>
  );
}