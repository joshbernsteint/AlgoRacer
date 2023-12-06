// import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import styles from './Navbar.module.css';
import axios from 'axios'

export default function NavBar(props) {
  return (
    <div>
      <div className={styles.nav}>
        <Link to="/" className={styles.nav_title}>AlgoRacer</Link>
        <div className={styles.nav_links}>
          <Link to="/practice" className={styles.nav_btn}>Practice</Link>
          <Link to="/compete" className={styles.nav_btn}>Play</Link>
          <Link to="/learn" className={styles.nav_btn}>Learn</Link>
          <Link to="/leaderboards" className={styles.nav_btn}>Leaderboards</Link>
          {
            (props.userData == null) ? (<Link to="/login" className={styles.nav_btn}>Login</Link>): (<Link onClick={async () => {const {data} = await axios.get("/logout"); if(data.loggedOut){props.setLogin(undefined)}}} className={styles.nav_btn}>Logout</Link>)
          }
        </div>
      </div>
    </div>
  )
}