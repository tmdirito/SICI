'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './FeaturesSection.module.css';

const features = [
  {
    title: "Powered by Gemini",
    desc: "Leveraging Google's latest generative AI for fast and accurate results.",
  },
  {
    title: "Conservation Insights",
    desc: "Learn about protecting wildlife and the conservation status of different species.",
  },
  {
    title: "Personal History",
    desc: "Keep a log of all the animals you've identified in your personal dashboard.",
  },
];

export default function FeaturesSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFeature = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        {/* Left side: Title + List */}
        <div className={styles.left}>
          <h2 className={styles.heading}>FEATURES</h2>

          <div className={styles.featureList}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                <div
                  className={styles.featureHeader}
                  onClick={() => toggleFeature(index)}
                >
                  <h3>{feature.title}</h3>
                  <span className={styles.toggleIcon}>
                    {openIndex === index ? '-' : '+'}
                  </span>
                </div>

                {openIndex === index && (
                  <p className={styles.featureDesc}>{feature.desc}</p>
                )}

                {index !== features.length - 1 && <div className={styles.divider}></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Single Image */}
        <div className={styles.right}>
       

        <Image
  src="/images/leopard2.webp"
  alt="Features Illustration"
  width={500}       // MUST specify width
  height={600}      // MUST specify height
  className={styles.sideImage}
/>
        </div>
      </div>
    </section>
  );
}