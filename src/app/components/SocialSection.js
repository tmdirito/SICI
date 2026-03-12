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
        <div className={`${styles.socialIcon} ${styles.instagram}`}>
          <FaInstagram />
          <span>Instagram</span>
        </div>

        <div className={`${styles.socialIcon} ${styles.twitter}`}>
          <FaTwitter />
          <span>Twitter</span>
        </div>

        <div className={`${styles.socialIcon} ${styles.whatsapp}`}>
          <FaWhatsapp />
          <span>WhatsApp</span>
        </div>

        <div className={`${styles.socialIcon} ${styles.facebook}`}>
          <FaFacebookF />
          <span>Facebook</span>
        </div>
      </div>
    </section>
  );
}