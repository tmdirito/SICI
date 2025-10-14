import React from 'react';
// 1. Import the new CSS module
import styles from './NavBar.module.css';

export default function NavBar() {
  return (
    // 2. Apply the style to the nav element
    <nav className={styles.nav}>
      <a
        href="/tutorial"
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-all duration-200"
      >
        Tutorial
      </a>
      {/* Add any other nav links here */}
    </nav>
  );
}