import React from 'react';

import styles from './Home.module.css';

export default function Home() {
  return (
    <div>
      <div className={styles.home}>
        <h1>Welcome To <span className={styles.title}>AlgoRacer</span></h1>
      </div>
    </div>
  )
}