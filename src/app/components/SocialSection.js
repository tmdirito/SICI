"use client";

import { FaInstagram, FaTwitter, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import styles from "./SocialSection.module.css";

export default function SocialSection() {
  return (
    <section className={styles.socialSection}>
      <div className={styles.socialHeader}>
        <h2>Follow Us on Social</h2>
        <button className={styles.socialBtn}>Social</button>
      </div>

      <div className={styles.socialIcons}>
        
        <a href="https://www.instagram.com/theofficialecodex/" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.instagram}`}>
          <FaInstagram />
          <span>Instagram</span>
        </a>

        <a href="https://x.com/EcoDexOfficial" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.twitter}`}>
          <FaTwitter />
          <span>Twitter</span>
        </a>

        

        <a href="https://www.facebook.com/profile.php?id=61580582630908" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.facebook}`}>
          <FaFacebookF />
          <span>Facebook</span>
        </a>

      </div>
    </section>
  );
}