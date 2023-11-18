import React from 'react';

import styles from './Practice.module.css';

import GameBoard from '../GameBoard/GameBoard';

export default function Practice() {
  return (
    <div>
      <h1>Practice</h1>
      <div className={styles.main}>
        <h1>Practice</h1>
        <GameBoard boardSize={5} />
      </div>
    </div>
  )
}