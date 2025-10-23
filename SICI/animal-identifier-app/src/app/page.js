import Link from 'next/link';
import styles from './home.module.css';
import NavBar from './components/NavBar';
import Image from 'next/image';
import Header from './components/Header';
export default function HomePage() {
  return (
    <div className={styles.container}>
      <Header/>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Discover the Wild: Identify Animals with AI
            </h1>
            <p className={styles.description}>
              Upload a photo, and let our powerful AI tell you about the
              animal, its habitat, and conservation status.
            </p>
            <div className={styles.ctaContainer}>
              <Link href="/dashboard" className={styles.button}>
                Get Started
              </Link>
              <Link href="#how-it-works" className={`${styles.button} ${styles.buttonSecondary}`}>
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className={styles.section}>
          <h2 className={styles.sectionTitle}>How It Works in 3 Easy Steps</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <h3>1. Upload Your Photo</h3>
              <p>Select an image of an animal from your device. Clear, high-quality photos work best!</p>
            </div>
            <div className={styles.stepCard}>
              <h3>2. AI-Powered Identification</h3>
              <p>Our Gemini-powered model analyzes the image to identify the animal's species.</p>
            </div>
            <div className={styles.stepCard}>
              <h3>3. Get Detailed Info</h3>
              <p>Receive the animal's common and scientific name, a detailed description, and its current conservation status.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Features</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h4>Powered by Gemini</h4>
              <p>Leveraging Google's latest generative AI for fast and accurate results.</p>
            </div>
            <div className={styles.featureCard}>
              <h4>Conservation Insights</h4>
              <p>Learn about the importance of protecting wildlife and the conservation status of different species.</p>
            </div>
            <div className={styles.featureCard}>
              <h4>Personal History</h4>
              <p>Keep a log of all the animals you've identified in your personal dashboard.</p>
            </div>
          </div>
        </section>

      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Animal Identifier. All rights reserved.</p>
      </footer>
    </div>
  );
}
