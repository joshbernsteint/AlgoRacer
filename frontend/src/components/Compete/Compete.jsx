import React, { useState, useEffect } from 'react';

import styles from './Compete.module.css';

import AgainstAi from './AgainstAi';
import AgainstPlayer from './AgainstPlayer';

export default function Compete() {
  const [againstAi, setAgainstAi] = useState(true);
  const [showButtons, setShowButtons] = useState(true);
  const [difficulty, setDifficulty] = useState('none'); // ['beginner', 'normal', 'insane']
  const [boardType, setBoardType] = useState('none'); // ['bubble', 'insertion', 'selection', 'merge']
  const [showBoardType, setShowBoardType] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);

  const [inGame, setInGame] = useState(false);

  function handleButtons(type) {
    setShowButtons(false);
    setAgainstAi(type);
    setShowBoardType(true);
  }

  function handleBoardType(type) {
    setBoardType(type);
    setShowBoardType(false);
    setShowDifficulty(true);
  }

  function handleDifficulty(type) {
    setDifficulty(type);
    setShowDifficulty(false);
    setInGame(true);
  }

  function handleBack() {
    if (!showButtons && !showDifficulty) {
      setShowButtons(true);
      showBoardType ? setShowBoardType(false) : setShowDifficulty(false);
    } else if (!showButtons && !showBoardType) {
      setShowDifficulty(false);
      setShowBoardType(true);
      setBoardType('none');
    } else if (showDifficulty) {
      setDifficulty('none');
      setShowDifficulty(false);
      setShowBoardType(true);
    } else {
      setBoardType('none');
      setDifficulty('none');
      setShowBoardType(false);
      setShowDifficulty(false);
      setShowButtons(true);
    }
  }

  function handleLeave() {
    setInGame(false);
    setShowButtons(true);
    setDifficulty('none');
    setBoardType('none');
    setShowBoardType(false);
    setShowDifficulty(false);
  }

  return (
    <div>
      <div className={styles.main}>
        <h1>Compete</h1>
        {showButtons || showBoardType || showDifficulty ? null : difficulty === 'none' || boardType === 'none' ? null : againstAi ? <AgainstAi difficulty={difficulty} boardType={boardType} /> : <AgainstPlayer difficulty={difficulty} boardType={boardType} />}
        {!showButtons ? null : (
          <div className={styles.select_container}>
            <button className={styles.select_btn} onClick={() => handleButtons(true)}>Against AI</button>
            <button className={styles.select_btn} onClick={() => handleButtons(false)}>Against Player</button>
          </div>
        )}
        {showDifficulty ? (
          <div className={styles.select_container}>
            <button className={styles.select_btn} onClick={() => handleDifficulty('beginner')}>Beginner</button>
            <button className={styles.select_btn} onClick={() => handleDifficulty('normal')}>Normal</button>
            <button className={styles.select_btn} onClick={() => handleDifficulty('insane')}>Insane</button>
          </div>
        ) : null}
        {showBoardType ? (
          <div className={styles.select_container}>
            <button className={styles.select_btn} onClick={() => handleBoardType('bubble')}>Bubble Sort</button>
            <button className={styles.select_btn} onClick={() => handleBoardType('insertion')}>Insertion Sort</button>
            <button className={styles.select_btn} onClick={() => handleBoardType('selection')}>Selection Sort</button>
            <button className={styles.select_btn} onClick={() => handleBoardType('merge')}>Merge Sort</button>
          </div>
        ) : null}
        {showButtons || inGame ? null : <button className={styles.back_btn} onClick={() => handleBack()}>Back</button>}
        {/* {!inGame ? null : <button className={styles.back_btn} onClick={() => handleLeave()}>Leave</button>} */}
      </div>
    </div>
  )
}