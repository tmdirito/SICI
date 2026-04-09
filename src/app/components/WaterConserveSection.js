"use client";

import React from "react";
import styles from "./WaterConserveSection.module.css";

const newsItems = [
  {
    title: "Global Water Conservation Efforts Expand",
    image: "/images/waterSaving.jpg",
    description:
      "Major international programs are working to protect freshwater resources worldwide.",
  },
  {
    title: "How Households Can Reduce Water Waste",
    image: "images/wachingMachine.jpg",
    description: 
      "Simple everyday habits that significantly lower indoor water use.",
  },
  {
    title: "AI Technology Improving Water Efficiency",
    image: "images/outdoor.jpg",
    description:
      "Smart monitoring systems help track and reduce water consumption.",
  },
  {
    title: "Saving Wildlife Through River Protection",
    image: "images/school.jpg",
    description:
      "Protecting rivers ensures survival of animals and ecosystems.",
  },
];

export default function WaterNewsSection() {
  const mainNews = newsItems[0];
  const sideNews = newsItems.slice(1);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Water & Conservation News</h2>

      <div className={styles.newsLayout}>
        
        {/* BIG MAIN NEWS */}
        <div className={styles.mainNews}>
          <img src={mainNews.image} alt={mainNews.title} />
          <div className={styles.overlay}>
            <h3>{mainNews.title}</h3>
            <p>{mainNews.description}</p>
          </div>
        </div>

        {/* SMALL SIDE NEWS */}
        <div className={styles.sideNews}>
          {sideNews.map((item, index) => (
            <div key={index} className={styles.smallCard}>
              <img src={item.image} alt={item.title} />
              <div className={styles.smallOverlay}>
                <h4>{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}