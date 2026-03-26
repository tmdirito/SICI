import styles from "../home.module.css";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import StepsSection from "../components/StepsSection";
import FeaturesSection from "../components/FeaturesSection";
import AboutMission from "../components/AboutMission";
import HabitatMap from "../components/HabitatMap";
import HabitatMap1 from "../components/EarthUpdate";
import ContactSection  from "../components/ContactSection";
import WaterAppointmentsection from "../components/WaterAppointmentSection";
import WaterConserveSection from "../components/WaterConserveSection";
import SocialSection from "../components/SocialSection";

export default function AnimalsPage() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <HeroSection />
        <StepsSection />
        <FeaturesSection />
        <AboutMission />
        <HabitatMap1 />
        <ContactSection />
        <WaterAppointmentsection />
        <WaterConserveSection />
        <SocialSection />
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 Eco-Dex.com. All rights reserved.</p>
      </footer>
    </div>
  );
}