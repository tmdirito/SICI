import Link from "next/link";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const videoSrc = "/videos/nature-love.mp4";

  return (
    <section className={styles.heroSection}>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto" 
        className={styles.backgroundVideo}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <h1 className={styles.title}>Discover the Wild with AI</h1>
        <p className={styles.subtitle}>
          Upload a photo and uncover the secrets of wildlife — from species name
          to conservation status.
        </p>

        <div className={styles.buttons}>
          <Link href="/dashboard" className={styles.primaryBtn}>
            Get Started
          </Link>
          <Link href="#how-it-works" className={styles.secondaryBtn}>
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}