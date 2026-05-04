import React from "react";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  return (
    <section className={styles.contactSection}>
      <div className={styles.sectionDivider}></div>

      <div className={styles.contactContainer}>
        <div className={styles.contactLeft}>
          <h2>Contact Us</h2>
          <p>
            Interested to be a member of our team? Fill out some info and we’ll
            be in touch shortly. We can’t wait to hear from you!
          </p>
        </div>

        <div className={styles.contactRight}>
          <form className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label>
                Name <span>(Required)</span>
              </label>
              <div className={styles.nameRow}>
                <input type="text" placeholder="First Name" required />
                <input type="text" placeholder="Last Name" required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>
                Email <span>(Required)</span>
              </label>
              <input type="email" placeholder="Email" required />
            </div>

            <div className={styles.formGroup}>
              <label>
                Message <span>(Required)</span>
              </label>
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>

            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </section>
  );
}