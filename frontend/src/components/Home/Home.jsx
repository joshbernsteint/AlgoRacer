import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './Home.module.css';

import PixelSVG from '../Misc/PixelSVG';

import compete from "./gifs/compete.gif";
import learn from "./gifs/learn.gif";
import practice from "./gifs/practice.gif";

export default function Home() {
  const [showGif, setShowGif] = useState(false);
  const [currGif, setCurrGif] = useState(null);

  function handleHoverEnter(gif) {
    setShowGif(true);
    setCurrGif(gif);
  }

  function handleHoverLeave() {
    setShowGif(false);
    setCurrGif(null);
  }

  return (
    <div className={styles.home}>
      <div className={styles.content}>
        <h1>Welcome To <span className={styles.title}>AlgoRacer!</span></h1>
        <div className={styles.description}>
          <p>AlgoRacer is a platform to learn and practice algorithms and data structures. It provides both a competitive and relaxing environment to learn and improve your skills at solving common sorting algorithms by hand, with more to come!</p>
        </div>
        <div className={styles.links}>
          <Link to="/learn" className={styles.link} onMouseEnter={() => handleHoverEnter(learn)} onMouseLeave={() => handleHoverLeave()}>Start Learning</Link>
          <Link to="/practice" className={styles.link} onMouseEnter={() => handleHoverEnter(practice)} onMouseLeave={() => handleHoverLeave()} >Start Practicing</Link>
          <Link to="/compete" className={styles.link} onMouseEnter={() => handleHoverEnter(compete)} onMouseLeave={() => handleHoverLeave()}>Test Your Skills!</Link>
        </div>
        {showGif && currGif && <div className={styles.gif_box}>
          {showGif && currGif !== null && <img src={currGif} alt="gif" className={styles.gif} />}
        </div>}
        <div className={styles.footer}>
          <PixelSVG />
        </div>
      </div>
    </div>
  )
}