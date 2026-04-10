import React from "react";
import styles from "./landing.module.css";
import { FaArrowRight } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import Link from "next/link";

const WildlifeLanding = () => {
  return (
    <div className={styles["wildlife-container"]}>
      
      {/* Header */}
      <header className={styles["wildlife-header"]}>
        <div className={styles["header-left"]}>
        <div className={styles["natgeo-box"]}>
  <img src="/images/transparent-logo.png" alt="Logo" />
</div>

          <div className={styles["natgeo-text"]}>
            Eco-Dex <br />
            Identify the wild through your lens
          </div>
        </div>

        
      </header>

      {/* Main */}
      <main className={styles["wildlife-main"]}>
        
        {/* Left */}
        <div className={styles["main-left"]}>
          <h2 className={styles["save-text"]}>Discover</h2>

          <h1 className={styles["wildlife-title"]}>
            <span className={styles["text-black"]}>Flora & Fa</span>
            <span className={styles["text-white"]}>una</span>
          </h1>

          <p className={styles["desc-text"]}>
          Turn curiosity into discovery<br />
          identify and explore the incredible 
          species living all around you, 
           waiting to be noticed.
          </p>

          <Link href="/animals">
  <button className={styles["learn-more-btn"]}>
    Let's Explore
    <span className={styles["arrow-circle"]}>
      <FaArrowRight size={15} />
    </span>
  </button>
</Link>

          <div className={styles["hand-arrow-layer"]}>
  <img
    src="/images/arrow.png"  // your arrow image
    alt="Arrow pointing upward"
    className={styles["arrow-image"]}
  />
</div>
        </div>

        {/* Center */}
        <div className={styles["main-center"]}>
          <img
            src="/images/cool.png" 
            alt="Savanna"
            className={styles["center-image"]}
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        {/* Right */}
        <div className={styles["main-right"]}>
          <h2 className={styles["worlds-text"]}>Journey into</h2>
          <h1 className={styles["nature-text"]}>Nature's</h1>
          <h2 className={styles["danger-text"]}>legacy</h2>

          <div className={styles["right-divider"]}></div>

          <p className={styles["right-desc"]}>
            We should take necessary steps <br />
            to save them for our existence.
          </p>

        </div>

        {/* Cheetah */}
        <div className={styles["cheetah-layer"]}>
          <img
            src="/images/FaceDeer.png"
            alt="Cheetah"
            className={styles["cheetah-img"]}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className={styles["wildlife-footer"]}>
        
        <div className={styles["footer-left"]}>
          <p className={styles["footer-desc"]}>
            Wildlife conservation is the protection and preservation of
            species and their habitats.
          </p>

          <a href="https://www.nwf.org" target="_blank" rel="noopener noreferrer">
           <button className={styles["read-more-btn"]}>
          READ MORE
        </button>
</a>
        </div>

        <div className={styles["footer-divider"]}></div>

        <div className={styles["footer-right"]}>
          <p className={styles["footer-join"]}>Join our <FaTwitter style={{ color: "#1DA1F2", marginRight: "5px" }} /> handle</p>
          <a href="https://x.com/EcoDexOfficial" target="_blank" rel="noopener noreferrer">
           <button className={styles["handle-btn"]}>@Eco-Dex</button>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default WildlifeLanding;