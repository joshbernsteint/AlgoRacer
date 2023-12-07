import React, { useState } from 'react';

import styles from './Practice.module.css';

import GameBoard from '../GameBoards/GameBoard';
import Tutorial from '../Tutorial/Tutorial';

export default function Practice() {
  const [difficulty, setDifficulty] = useState('none'); // ['beginner', 'normal', 'insane']
  const [boardSize, setBoardSize] = useState(5); // [5, 10, 15]
  const [boardType, setBoardType] = useState('none'); // ['bubble', 'insertion', 'selection', 'merge']
  const [showTutorial, setShowTutorial] = useState(false);

  function selectDifficulty() {
    return (
      <div className={styles.select_container}>
        <button className={styles.select_btn} onClick={() => {
          setDifficulty('beginner'); setShowTutorial(false)
        }}>Beginner</button>
        <button className={styles.select_btn} onClick={() => { setDifficulty('normal'); setShowTutorial(false) }}>Normal</button>
        <button className={styles.select_btn} onClick={() => { setDifficulty('insane'); setShowTutorial(false) }}>Insane</button>
      </div>
    )
  }

  function selectBoardType() {
    return (
      <div className={styles.select_container}>
        <button className={styles.select_btn} onClick={() => setBoardType('bubble')}>Bubble Sort</button>
        <button className={styles.select_btn} onClick={() => setBoardType('insertion')}>Insertion Sort</button>
        <button className={styles.select_btn} onClick={() => setBoardType('selection')}>Selection Sort</button>
      </div>
    )
  }

  function handleBack() {
    if (boardType === 'none') {
      setBoardType('none');
      setShowTutorial(false);
    } else if (boardType !== 'none' && difficulty === 'none') {
      setBoardType('none');
      setShowTutorial(false);
    } else if (boardType !== 'none' && difficulty !== 'none') {
      setDifficulty('none');
      setShowTutorial(false);
    } else {
      setBoardType('none');
      setDifficulty('none');
    }
  }

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.heading}>
          <div className={styles.titles}>
            <h1>Practice</h1>
          </div>
          {boardType === 'none' ? <h2>Select Board Type</h2> : null}
          {difficulty === 'none' && boardType !== 'none' ? <h2>Select Difficulty</h2> : null}
          {difficulty !== 'none' && boardType !== 'none' ? <h2>Difficulty: {difficulty === "beginner" ? "Beginner" : difficulty === "normal" ? "Normal" : "Insane"}</h2> : null}
          {difficulty !== 'none' && boardType !== 'none' ? <h2>Board Type: {boardType === "bubble" ? "Bubble Sort" : boardType === "insertion" ? "Insertion Sort" : "Selection Sort"}</h2> : null}
        </div>
        <div>
          {boardType === 'none' ? selectBoardType() : null}
          {difficulty === 'none' && boardType !== 'none' ? selectDifficulty() : null}
          {difficulty === 'none' ? null : <GameBoard boardSize={boardSize} difficulty={difficulty} boardType={boardType} />}
          <div className={styles.bottom_btns}>
            {boardType === 'none' ? null : <button className={styles.back_btn} onClick={() => handleBack()}>Back</button>}
            {boardType !== 'none' && difficulty !== 'none' ? null : <button className={styles.tutorial_btn} onClick={() => setShowTutorial(!showTutorial)}>Tutorial</button>}
          </div>
        </div>
        {showTutorial === true ? <Tutorial /> : null}
      </div>
    </div>
  )
}