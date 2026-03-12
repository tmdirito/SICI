"use client";
import { useState, useEffect } from "react";
import Globe from "react-globe.gl";

export default function HabitatMap() {
  const [selected, setSelected] = useState(null);
  const [flippedGlobeUrl, setFlippedGlobeUrl] = useState(null);

  // Detailed species data
  const userSpecies = [
    {
      name: "Amur Leopard",
      sciName: "Panthera pardus orientalis",
      status: "Critically Endangered",
      habitat: "Temperate forests of SE Russia & NE China",
      diet: "Deer, hares, small mammals",
      lifespan: "10–15 years in the wild",
      threats: "Poaching, habitat loss, human encroachment",
      count: "120–130",
      lat: 45,
      lng: 135,
      desc: "One of the rarest big cats on Earth, primarily found in the Russian Far East.",
      img: "/images/amur_leopard.jpg",
    },
    {
      name: "Hawksbill Turtle",
      sciName: "Eretmochelys imbricata",
      status: "Critically Endangered",
      habitat: "Tropical coral reefs in Atlantic, Pacific & Indian Oceans",
      diet: "Sponges, small invertebrates",
      lifespan: "30–50 years",
      threats: "Illegal trade of shells, habitat destruction, fishing bycatch",
      count: "8,000",
      lat: 15,
      lng: -70,
      desc: "Famous for its beautiful shell; plays a critical role in reef ecosystems.",
      img: "/images/turtle.jpg",
    },
    {
      name: "Sumatran Orangutan",
      sciName: "Pongo abelii",
      status: "Endangered",
      habitat: "Tropical rainforests of Sumatra, Indonesia",
      diet: "Fruits, leaves, insects",
      lifespan: "30–40 years in the wild",
      threats: "Deforestation, illegal pet trade, palm oil plantations",
      count: "14,000",
      lat: -0.5,
      lng: 101,
      desc: "Highly intelligent great apes with strong family bonds and tool use.",
      img: "/images/Sumatran.avif",
    },
    {
      name: "Black Rhino",
      sciName: "Diceros bicornis",
      status: "Critically Endangered",
      habitat: "Savannas and tropical bushland of southern Africa",
      diet: "Leaves, shoots, branches, fruits",
      lifespan: "35–50 years",
      threats: "Poaching for horns, habitat loss",
      count: "5,500",
      lat: -15,
      lng: 25,
      desc: "A heavily poached species with a prehensile lip for browsing shrubs.",
      img: "/images/blackRhino.avif",
    },
    {
      name: "Vaquita",
      sciName: "Phocoena sinus",
      status: "Critically Endangered",
      habitat: "Northern part of the Gulf of California, Mexico",
      diet: "Small fish and squid",
      lifespan: "20 years",
      threats: "Illegal gillnets, bycatch",
      count: "≈20",
      lat: 31,
      lng: -114,
      desc: "World's rarest marine mammal, extremely elusive and endangered.",
      img: "/images/vaquita.webp",
    },
  ];

  // Flip globe texture to fix poles
  useEffect(() => {
    const src = "/images/earthMaterial.jpeg";
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.translate(0, img.height);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, 0);
      try {
        setFlippedGlobeUrl(canvas.toDataURL("image/jpeg"));
      } catch {
        setFlippedGlobeUrl(src);
      }
    };
  }, []);

  const globeImage = flippedGlobeUrl || "/images/earthMaterial.jpeg";

  return (
    <div
      style={{
        position: "relative",
        width: "800px",
        height: "800px",
        margin: "auto",
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "0 0 25px rgba(0,255,179,0.4)",
      }}
    >
      {/* 🌍 Interactive Globe */}
      <Globe
        globeImageUrl={globeImage}
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        labelsData={userSpecies}
        labelLat={(d) => d.lat}
        labelLng={(d) => d.lng}
        labelText={(d) => d.name}
        labelSize={1.3}
        labelDotRadius={0.3}
        labelColor={() => "#00ffb3"}
        labelAltitude={0.02}
        onLabelClick={setSelected}
        enablePointerInteraction
        animateIn={true}
        autoRotate={true}
        autoRotateSpeed={0.8}
        width={800}
        height={800}
      />

      {/* 📌 Popup Info Table */}
      {selected && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 20, 15, 0.95)",
            color: "#e3fff5",
            borderRadius: "12px",
            padding: "1.2rem 1.5rem",
            width: "420px",
            maxHeight: "550px",
            overflowY: "auto",
            boxShadow: "0 0 20px rgba(0,255,179,0.3)",
            border: "2px solid #00ffb3",
            textAlign: "center",
          }}
        >
          <img
            src={selected.img}
            alt={selected.name}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "12px",
              border: "2px solid #00ffb3",
            }}
          />
          <h2 style={{ color: "#00ffb3", marginBottom: "8px" }}>{selected.name}</h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "10px",
              fontSize: "0.95rem",
            }}
          >
            <tbody>
              <tr>
                <td style={{ textAlign: "left", color: "#00ffb3", padding: "6px" }}>Scientific Name:</td>
                <td style={{ textAlign: "right", color: "#bfffe3", padding: "6px" }}>{selected.sciName}</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", color: "#00ffb3", padding: "6px" }}>Status:</td>
                <td style={{ textAlign: "right", color: "#ff7f7f", padding: "6px" }}>{selected.status}</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", color: "#00ffb3", padding: "6px" }}>Habitat:</td>
                <td style={{ textAlign: "right", color: "#bfffe3", padding: "6px" }}>{selected.habitat}</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", color: "#00ffb3", padding: "6px" }}>Diet:</td>
                <td style={{ textAlign: "right", color: "#bfffe3", padding: "6px" }}>{selected.diet}</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", color: "#00ffb3", padding: "6px" }}>Lifespan:</td>
                <td style={{ textAlign: "right", color: "#bfffe3", padding: "6px" }}>{selected.lifespan}</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", color: "#00ffb3", padding: "6px" }}>Population Count:</td>
                <td style={{ textAlign: "right", color: "#bfffe3", padding: "6px" }}>{selected.count}</td>
              </tr>
              <tr>
                <td style={{ textAlign: "left", color: "#00ffb3", padding: "6px" }}>Threats:</td>
                <td style={{ textAlign: "right", color: "#bfffe3", padding: "6px" }}>{selected.threats}</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: "0.9rem", color: "#bfffe3" }}>{selected.desc}</p>
          <button
            style={{
              marginTop: "10px",
              background: "#00ffb3",
              color: "#001a12",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => setSelected(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}