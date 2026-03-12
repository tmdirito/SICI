'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from './NavBar.module.css';

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Hide mobile menu if window resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const renderLinks = () => (
    <>
      {currentUser && (
        <Link href="/dashboard" className={styles.linkStyle} onClick={() => setIsOpen(false)}>
          Identify Animals
        </Link>
      )}
      <Link href="/" className={styles.linkStyle} onClick={() => setIsOpen(false)}>
        Home
      </Link>
      <Link href="/history" className={styles.linkStyle} onClick={() => setIsOpen(false)}>
        History
      </Link>
      <Link href="/tutorial" className={styles.linkStyle} onClick={() => setIsOpen(false)}>
        Tutorial
      </Link>
      <Link href="/about" className={styles.linkStyle} onClick={() => setIsOpen(false)}>
        About
      </Link>
    </>
  );

  const renderAuth = () => (
    <>
      {currentUser ? (
        <>
          <span className={styles.userGreeting}>Hi, {currentUser.email}</span>
          <button onClick={handleLogout} className={styles.authButton}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className={styles.authButton} onClick={() => setIsOpen(false)}>
            Login
          </Link>
          <Link href="/signup" className={styles.authButton} onClick={() => setIsOpen(false)}>
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className={styles.nav}>
     

      {/* Desktop Links */}
      <div className={styles.navLinks}>{renderLinks()}</div>
      <div className={styles.authLinks}>{renderAuth()}</div>

      {/* Hamburger Button */}
      <div className={styles.hamburger} onClick={toggleMenu}>
        <span />
        <span />
        <span />
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          {renderLinks()}
          {renderAuth()}
        </div>
      )}
    </nav>
  );
}