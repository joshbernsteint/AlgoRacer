import React, { useState, useEffect } from 'react';

import styles from './Compete.module.css';

export default function AgainstPlayer(props) {
  const [boardSize, setBoardSize] = useState(0);
  const [difficulty, setDifficulty] = useState(props.difficulty);
  const [boardType, setBoardType] = useState(props.boardType);

  return (
    <div>
      <div className={styles.main}>
        <h1>AgainstPlayer</h1>
      </div>
    </div>
  )
}