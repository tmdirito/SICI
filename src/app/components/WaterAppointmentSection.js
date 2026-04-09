"use client";

import React, { useState } from "react";
import styles from "./WaterAppointmentSection.module.css";

export default function WaterAppointmentSection() {
  const [flipped, setFlipped] = useState(false);

  const insights = [
    {
      title: "Daily AI Usage",
      percentage: 35,
      detail: "AI training models use 35% of our daily water footprint." 
    },
      
    {
      title: "Server Cooling",
      percentage: 25,
      detail: "Cooling data centers consumes 25% of water used by AI operations." ,
    },
    {
    title: "Data Transmission", 
    percentage: 15, 
    detail: "Water is indirectly used to produce electricity for data transfer." 
    },
    { title: "Miscellaneous",
    percentage: 25, 
    detail: "Other AI-related operations and maintenance account for 25%." 
},
  ];

  return (
    <section className={styles.section}>
      <div className={styles.cardWrapper}>
        <div className={`${styles.card} ${flipped ? styles.flipped : ""}`}>

          {/* FRONT SIDE */}
          <div className={styles.front}>
            <div className={styles.frontContent}>
              <img
                src="images/drink.jpg"
                alt="Water usage"
                className={styles.frontImage}
              />
              <div className={styles.frontText}>
                <h2>Do You Know How Much Water You Use Daily?</h2>
                <p>
                  Discover insights about your household water consumption
                  and learn simple ways to save water every day.
                </p>
                <button className={styles.flipBtn} onClick={() => setFlipped(true)}>
                  View Insights
                </button>
              </div>
            </div>
          </div>

          {/* BACK SIDE */}
          {/* BACK SIDE */}
<div className={styles.back}>
  <h3>AI Water Insights</h3>
  <div className={styles.insights}>
    {insights.map((insight, i) => (
      <div key={i} className={styles.insightBox}>
        <div className={styles.percentage}>{insight.percentage}%</div>
        <div className={styles.title}>{insight.title}</div>
        <div className={styles.detail}>{insight.detail}</div>
      </div>
    ))}
  </div>
  <button className={styles.backBtn} onClick={() => setFlipped(false)}>
    Go Back
  </button>
</div>

        </div>
      </div>
    </section>
  );
}