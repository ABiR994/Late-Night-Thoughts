import React, { useEffect, useState } from 'react';
import { useCursor } from '../context/CursorContext';

type LayoutProps = {
  children: React.ReactNode;
  blurBackground?: boolean;
};

const Layout = ({ children, blurBackground = false }: LayoutProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { ripples, shootingStars, fallingStars, isMistActive } = useCursor();

  useEffect(() => {

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative min-h-screen theme-midnight`}>
      
      {/* Mist Overlays */}
      <div className="mist-overlay mist-top" />
      <div className="mist-overlay mist-bottom" />
      <div className={`mist-sweep ${isMistActive ? 'mist-active' : ''}`} />

      {/* Ripple of Silence */}
      <div className="ripple-container">
        {ripples.map(id => (
          <div key={id} className="ripple-wave" />
        ))}
      </div>

      {/* Shooting Star Success */}
      {shootingStars.map(id => (
        <div key={id} className="shooting-star-success" />
      ))}

      {/* Falling Stars (Global Notifications) */}
      {fallingStars.map(star => (
        <div 
          key={star.id} 
          className="falling-star" 
          style={{ top: star.top, left: star.left }} 
        />
      ))}

      {/* Scroll Progress Shooting Star */}
      <div className="scroll-progress-container">
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="shooting-star-head" />
        </div>
      </div>

      {/* Ambient Background */}
      <div 
        className={`ambient-container transition-all duration-1000 ${blurBackground ? 'blur-xl scale-110 opacity-50' : 'blur-0 scale-100 opacity-100'}`} 
        aria-hidden="true"
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="stars" />
        <div className="stars-2" />
        <div className="stars-3" />
        <div className="noise" />
        <div className="grid-overlay" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;
