"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./StepsSection.module.css";

export default function StepsSection() {
  const steps = [
    { num: "1", title: "Upload Your Photo", desc: "Select an image of an animal from your device. Clear, high-quality photos work best!" },
    { num: "2", title: "AI-Powered Identification", desc: "Our Gemini-powered model analyzes the image to identify the animal's species." },
    { num: "3", title: "Get Detailed Info", desc: "Receive the animal's common and scientific name, description, and conservation status." },
  ];

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // trigger animation only when section is more than 50% visible
          setVisible(entry.intersectionRatio > 0.5);
        });
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) } // fine-grained
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => sectionRef.current && observer.unobserve(sectionRef.current);
  }, []);

  return (
    <section ref={sectionRef} className={styles.stepsSection}>
      <h2 className={styles.heading}>Steps to Use EcoDex</h2>
      <div className={styles.stepsWrapper}>
        {steps.slice(0, -1).map((_, index) => (
          <div
            key={index}
            className={`${styles.lineSegment} ${visible ? styles.segmentVisible : ""}`}
            style={{
              top: `${50 + index * 150}px`,
              transitionDelay: `${0.5 + index * 0.5}s`,
            }}
          />
        ))}

        {steps.map((step, index) => (
          <div key={index} className={styles.stepContainer}>
            <div
              className={`${styles.circle} ${visible ? styles.showCircle : ""}`}
              style={{ transitionDelay: `${index * 0.5}s` }}
            >
              {step.num}
            </div>
            <div
              className={`${styles.text} ${visible ? styles.showText : ""}`}
              style={{ transitionDelay: `${0.3 + index * 0.5}s` }}
            >
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
