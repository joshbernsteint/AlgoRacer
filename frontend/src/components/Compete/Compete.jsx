import React, { useState } from "react";

import styles from "./Compete.module.css";

import AgainstAi from "./AgainstAi";
import AgainstAiEndless from "./AgainstAiEndless";

export default function Compete(props) {
  const [againstAi, setAgainstAi] = useState(true);
  const [showButtons, setShowButtons] = useState(true);
  const [difficulty, setDifficulty] = useState("none"); // ['beginner', 'normal', 'insane']
  const [boardType, setBoardType] = useState("none"); // ['bubble', 'insertion', 'selection']
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
      setBoardType("none");
    } else if (showDifficulty) {
      setDifficulty("none");
      setShowDifficulty(false);
      setShowBoardType(true);
    } else {
      setBoardType("none");
      setDifficulty("none");
      setShowBoardType(false);
      setShowDifficulty(false);
      setShowButtons(true);
    }
  }

  // function handleLeave() {
  //   setInGame(false);
  //   setShowButtons(true);
  //   setDifficulty("none");
  //   setBoardType("none");
  //   setShowBoardType(false);
  //   setShowDifficulty(false);
  // }

  console.log(props.userData);

  return (
    <div>
      <div className={styles.main}>
        <h1 className="page_title">Play</h1>
        {!showButtons || showBoardType || showDifficulty ? null : (
          <h2 className="page_select">Select Game Mode</h2>
        )}
        {!showButtons ? againstAi ? <h2 className="page_select">Can you beat the bot to the last board?</h2> : <h2 className="page_select">The bot keeps speeding up, how will you fare?</h2> : null}
        {showButtons || !showBoardType || showDifficulty ? null : (
          <h2 className="page_select">Select Board Type</h2>
        )}
        {showButtons || showBoardType || !showDifficulty ? null : (
          <h2 className="page_select">Select Difficulty</h2>
        )}
        {showButtons || showBoardType || showDifficulty ? null : difficulty ===
          "none" || boardType === "none" ? null : againstAi ? (
            <AgainstAi difficulty={difficulty} boardType={boardType} userData={props.userData} handleBack={handleBack}/>
          ) : (
          <AgainstAiEndless difficulty={difficulty} boardType={boardType} userData={props.userData} handleBack={handleBack}/>
        )}
        {!showButtons ? null : (
          <div className={styles.select_container}>
            <button
              className={styles.select_btn}
              onClick={() => handleButtons(true)}
            >
              Race Against Bot
            </button>
            <button
              className={styles.select_btn}
              onClick={() => handleButtons(false)}
            >
              Endless Mode
            </button>
          </div>
        )}
        {showDifficulty ? (
          <div className={styles.select_container}>
            <button
              className={styles.select_btn}
              onClick={() => handleDifficulty("beginner")}
            >
              Beginner{againstAi ? ": 10 Boards" : ""}
            </button>
            <button
              className={styles.select_btn}
              onClick={() => handleDifficulty("normal")}
            >
              Normal{againstAi ? ": 20 Boards" : ""}
            </button>
            <button
              className={styles.select_btn}
              onClick={() => handleDifficulty("insane")}
            >
              Insane{againstAi ? ": 30 Boards" : ""}
            </button>
          </div>
        ) : null}
        {showBoardType ? (
          <div className={styles.select_container}>
            <button
              className={styles.select_btn}
              onClick={() => handleBoardType("bubble")}
            >
              Bubble Sort
            </button>
            <button
              className={styles.select_btn}
              onClick={() => handleBoardType("insertion")}
            >
              Insertion Sort
            </button>
            <button
              className={styles.select_btn}
              onClick={() => handleBoardType("selection")}
            >
              Selection Sort
            </button>
          </div>
        ) : null}
        {showButtons || inGame ? null : (
          <button className={styles.back_btn} onClick={() => handleBack()}>
            Back
          </button>
        )}
      </div>
    </div>
  );
}
