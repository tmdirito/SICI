"use client";
import styles from './page.module.css';
import UploadForm from './components/UploadForm';
import NavBar from './components/navbar';
import { useState } from 'react';

export default function HomePage() {
  return (
    <div className={styles.page}>
          <NavBar />
      <main className={styles.main}>
        <h1 className={styles.title}>Animal Identifier</h1>
        <p className={styles.description}>
          Upload a picture of an animal to learn more about it and its conservation status.
        </p>
        
        {/* The UploadForm component is placed inside the main card */}
        <UploadForm />
      </main>
    </div>
  );
}