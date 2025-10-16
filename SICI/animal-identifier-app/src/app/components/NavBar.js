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
      <a 
      href="/login"
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-all duration-200"
        >
          Login
        </a>
        <a 
      href="/info"
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-all duration-200"
        >
          Info
        </a>
        <a 
      href="/history"
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-all duration-200"
        >
          History
        </a>
    </nav>
  );
}