"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState('#0048ff'); // Default color
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };

  const openColorPicker = () => {
    colorInputRef.current?.click();
  };

  return (
    <div 
      className={`${styles.root} ${styles.body} ${isDarkMode ? styles.darkMode : styles.lightMode}`}
      style={{
        '--mouse-x': mousePosition.x,
        '--mouse-y': mousePosition.y,
        '--opaque-bg-color': selectedColor,
        '--selected-color': selectedColor,
        '--shadow-inset': `${selectedColor}33`,
        '--shadow-exterior': `${selectedColor}59`,
      } as React.CSSProperties}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <div 
            className={`${styles.circleSelector} ${isDarkMode ? styles.darkMode : styles.lightMode}`} 
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
          ></div>
          <div 
            className={`${styles.circleSelector} ${styles.colorSelect}`} 
            onClick={openColorPicker}
            aria-label="Select Theme Color"
          ></div>
          <input 
            ref={colorInputRef}
            type="color" 
            value={selectedColor}
            onChange={handleColorChange}
            style={{ display: 'none' }}
          />
        </header>
        <main>
          <h1 className={styles.heroText}>Site Under Construction!</h1>
          <button className={styles.button} aria-label="Contact Us">CONTACT US</button>
        </main>
      </div>
    </div>
  );
}
