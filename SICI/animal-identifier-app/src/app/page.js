'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./landing.module.css";

export default function LandingPage() {
  const [agreed, setAgreed] = useState(false);
  const [ecoText, setEcoText] = useState("");
  const fullText = "Where Every Species Tells a Story";

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setEcoText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 80); // speed of typing
    return () => clearInterval(interval);
  }, []);

  const handleCheckbox = (e) => {
    setAgreed(e.target.checked);
  };

  return (
    <div className={styles.landing}>
      {/* Title */}
      <Image
          src="/eco-dex dark.png"
          alt="Eco-Dex Logo - Return to Home"
          width={75}
          height={75}
        />
      <h1 className={styles.title}> Welcome to Eco-dex! </h1>
      <h1 className={styles.titleMain}>
        <span className={styles.typewriter}>{ecoText}</span>
      </h1>
      <h2 className={styles.titleheading2}>Step into the wild! From the tiniest, most delicate plants to the majestic creatures that roam forests, oceans, and skies, ECO-dex brings the endless adventure of nature right to your fingertips. Explore, learn, and uncover the hidden wonders of flora and fauna from around the globe, all in one interactive, beautifully curated experience. Every click, every discovery, every moment is a chance to connect with the world’s incredible biodiversity like never before.</h2>

      {/* Center GIF */}
      <img 
        src="/gifs/flower.gif" 
        alt="Nature Hero" 
        className={styles.heroGif} 
      />

      {/* Terms and Conditions Dialog */}
      <div className={styles.dialog}>
        <h2>Terms and Conditions</h2>
        <div className={styles.termsContent}>
          <p>
            Welcome to ECO-dex! Please read the following terms carefully.  
          </p>
          <p>
            By creating an account with EcoDex, you agree to the following terms:
Safety and Liability Waiver: EcoDex and its creators are NOT responsible for any injury, harm, property damage, or legal violations that occur while using this app. You are solely responsible for your own safety. Do not approach dangerous wildlife, trespass on private property, or put yourself in hazardous situations to acquire images.
Animal Welfare: Always maintain a safe and respectful distance from animals. Do not disturb nests, dens, or natural habitats.
Data Usage: Your uploaded images may be processed by AI to identify species and improve our conservation database.
          </p>
          
        </div>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" checked={agreed} onChange={handleCheckbox} />
 I agree to the Terms and Conditions and acknowledge the wildlife safety guidelines        </label>
        {/* Discover Button (appears only if agreed) */}
      {agreed && (
          <Link href="/animals">
            <button className={styles.discoverBtn}>
              Discover
            </button>
          </Link>
        )}
        
      </div>
      
    </div>
  );
}