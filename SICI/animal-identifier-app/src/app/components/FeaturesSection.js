'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './FeaturesSection.module.css';

const features = [
  {
    titleFeat: "Powered by Gemini",
    descFeat: "Leveraging Google's latest generative AI for fast and accurate results.",
  },
  {
    titleFeat: "Conservation Insights",
    descFeat: "Learn about protecting wildlife and the conservation status of different species.",
  },
  {
    titleFeat: "Personal History",
    descFeat: "Keep a log of all the animals you've identified in your personal dashboard.",
  },
];

export default function FeaturesSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFeature = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.featuresSectionFeat}>
      <div className={styles.containerFeat}>
        {/* Left side: Title + List */}
        <div className={styles.leftFeat}>
          <h2 className={styles.headingFeat}>FEATURES</h2>

          <div className={styles.featureListFeat}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureItemFeat}>
                <div
                  className={styles.featureHeaderFeat}
                  onClick={() => toggleFeature(index)}
                >
                  <h3>{feature.titleFeat}</h3>
                  <span className={styles.toggleIconFeat}>
                    {openIndex === index ? '-' : '+'}
                  </span>
                </div>

                {openIndex === index && (
                  <p className={styles.featureDescFeat}>{feature.descFeat}</p>
                )}

                {index !== features.length - 1 && <div className={styles.dividerFeat}></div>}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rightFeat}>
       

        <Image
  src="/images/leopard2.webp"
  alt="Features Illustration"
  width={500}       
  height={600}      
  className={styles.sideImageFeat}
/>
        </div>
      </div>
    </section>
  );
}