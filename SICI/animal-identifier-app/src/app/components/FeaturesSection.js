"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FeaturesSection.module.css";

const features = [
  {
    title: "Powered by Gemini",
    desc: "Leveraging Google's latest generative AI for fast and accurate results.",
    img: "/images/gemini2.avif",
  },
  {
    title: "Conservation Insights",
    desc: "Learn about protecting wildlife and the conservation status of different species.",
    img: "/images/leopard2.webp",
  },
  {
    title: "Personal History",
    desc: "Keep a log of all the animals you've identified in your personal dashboard.",
    img: "/images/collage.jpg",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const [animatedOnce, setAnimatedOnce] = useState(false); // tracks if animation ran

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedOnce) {
            setAnimatedOnce(true); // trigger animation only once
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => sectionRef.current && observer.unobserve(sectionRef.current);
  }, [animatedOnce]);

  return (
    <section ref={sectionRef} className={styles.featuresSection}>
      <h2 className={styles.heading}>Features</h2>
      <div className={styles.featuresWrapper}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            {/* Image starts center, moves left */}
            <div
              className={`${styles.imageWrapper} ${
                animatedOnce ? styles.moveLeft : ""
              }`}
              style={{ transitionDelay: `${index * 0.5}s` }}
            >
              <div className={styles.decorativeCircle}></div>
              <img
                src={feature.img}
                alt={feature.title}
                className={styles.featureImage}
              />
            </div>

            {/* Text stays centered, appears after image finishes */}
            <div
              className={`${styles.text} ${animatedOnce ? styles.showText : ""}`}
              style={{ transitionDelay: `${1.5 + index * 0.5}s` }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          </div>
        ))}
        
      </div>
    </section>
  );
}