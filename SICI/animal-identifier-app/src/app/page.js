import Link from "next/link";
import styles from "./home.module.css";
import NavBar from "./components/NavBar";
import Image from "next/image";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import StepsSection from "./components/StepsSection";
import FeaturesSection from "./components/FeaturesSection";
import AboutMission from "./components/AboutMission";
import HabitatMap from "./components/HabitatMap";
export default function HomePage() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {/* Hero Section */}
        <HeroSection />
        <StepsSection/>
        <FeaturesSection/>
        <AboutMission/>
        <HabitatMap/> 
        
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Animal Identifier. All rights reserved.</p>
      </footer>
    </div>
  );
}