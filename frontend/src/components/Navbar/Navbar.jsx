// import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import styles from './Navbar.module.css';

export default function NavBar() {
  return (
    <div>
      <div className={styles.nav}>
        <Link to="/" className={styles.nav_title}>AlgoRacer</Link>
        <div className={styles.nav_links}>
          <Link to="/about" className={styles.nav_btn}>About</Link>
          <Link to="/practice" className={styles.nav_btn}>Practice</Link>
          <Link to="/compete" className={styles.nav_btn}>Compete</Link>
          <Link to="/learn" className={styles.nav_btn}>Learn</Link>
        </div>
      </div>
    </div>
  )
}