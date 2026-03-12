"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "./tutorial.module.css";
import Header from "../components/Header";
import VineShape from "./VineShape";

export default function TutorialPage() {
  const controls = useAnimation();
  const ref = useRef(null);

  const steps = [
    {
      title: "Step 1: Choose Category",
      description:
        "Select whether you're identifying an animal or a plant. This helps the AI narrow down species precisely.",
    },
    {
      title: "Step 2: Upload Image",
      description:
        "Upload a clear, well-lit photo. Include distinct features like leaves, fur, or feathers for accuracy.",
    },
    {
      title: "Step 3: Enable Location",
      description:
        "Grant location access so the system can cross-check with species native to your area.",
    },
    {
      title: "Step 4: Analyze",
      description:
        "Hit the Analyze button and watch as EcoDex reveals your result, species info, and details.",
    },
    {
      title: "Step 5: Review Results",
      description:
        "Get extended insights on similar species, fun facts, and ecological importance.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) controls.start("visible");
        else controls.start("hidden");
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, [controls]);

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.title}>How to Use EcoDex</h1>
          <p className={styles.description}>
            Follow these simple steps — watch as each one comes alive like nature itself.
          </p>

          <section ref={ref} className={styles.timelineSection}>
            <div className={styles.stepsContainer}>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className={styles.step}
                  initial={{ opacity: 0, y: 80, scale: 0.9 }}
                  animate={controls}
                  variants={{
                    hidden: { opacity: 0, y: 80, scale: 0.9 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { delay: 0.5 + index * 0.4, duration: 0.8, ease: "easeOut" },
                    },
                  }}
                >
                  {/* VineShape SVG replaces number */}
                  <div className={styles.vineStep}>
                    <VineShape />
                  </div>

                  <div className={styles.text}>
                    <h2>{step.title}</h2>
                    <p>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}