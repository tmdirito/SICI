"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AboutMission.module.css";

export default function AboutMission() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => sectionRef.current && observer.unobserve(sectionRef.current);
  }, []);

  return (
    <section ref={sectionRef} className={styles.aboutSection}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.bgVideo}
      >
        <source src="/videos/nature-bg.mp4" type="video/mp4" />
      </video>

      <div className={`${styles.overlay} ${visible ? styles.fadeIn : ""}`}>
        <h2 className={styles.heading}>Our Mission</h2>
        <p className={styles.text}>
          We unite <span>Artificial Intelligence</span> with the wonders of
          nature to empower people in identifying, learning, and protecting
          wildlife. Each discovery brings us one step closer to a more
          conscious and sustainable planet.
        </p>
      </div>
    </section>
  );
}