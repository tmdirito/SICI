"use client";

import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  // We use a ref to grab the form data easily
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    // These IDs are found in your EmailJS Dashboard
    const serviceID = "service_uddceij";
    const templateID = "template_tnv1ek1";
    const publicKey = "Q221R7fQVcWxMsliW";

    emailjs.sendForm(serviceID, templateID, form.current, publicKey)
      .then((result) => {
          console.log(result.text);
          alert("Message sent successfully!");
          e.target.reset(); // This clears the form after sending
      }, (error) => {
          console.log(error.text);
          alert("Failed to send message. Please try again.");
      });
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.sectionDivider}></div>

      <div className={styles.contactContainer}>
        {/* LEFT SIDE */}
        <div className={styles.contactLeft}>
          <h2>Contact Us</h2>
          <p>
            Interested to be a member of our team? Fill out some info and we’ll
            be in touch shortly. We can’t wait to hear from you!
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.contactRight}>
          {/* Added the ref and the onSubmit handler here */}
          <form ref={form} onSubmit={sendEmail} className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label>
                Name <span>(Required)</span>
              </label>
              <div className={styles.nameRow}>
                {/* Added 'name' attributes so EmailJS knows which is which */}
                <input type="text" name="first_name" placeholder="First Name" required />
                <input type="text" name="last_name" placeholder="Last Name" required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>
                Email <span>(Required)</span>
              </label>
              <input type="email" name="user_email" placeholder="Email" required />
            </div>

            <div className={styles.formGroup}>
              <label>
                Message <span>(Required)</span>
              </label>
              <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
            </div>

            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </section>
  );
}