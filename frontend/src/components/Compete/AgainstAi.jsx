import React, { useState, useEffect, useCallback, useRef } from 'react';

import styles from './Compete.module.css';

import CompeteBoard from '../GameBoards/CompeteBoard';
import AiBoard from '../GameBoards/AiBoard';

import { BubbleSort, InsertionSort, SelectionSort } from '../../algos/Algos';
import { useNavigate } from 'react-router-dom';
import Tutorial from '../Tutorial/Tutorial';

export default function AgainstAi(props) {

  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const [userBoard, setUserBoard] = useState(0);
  const [aiBoard, setAiBoard] = useState(0);

  const [boardType, setBoardType] = useState(props.boardType);
  const [difficulty, setDifficulty] = useState(props.difficulty);
  const [boardSize, setBoardSize] = useState(5);
  const [randomList, setRandomList] = useState([]);
  const [sortedLists, setSortedLists] = useState([]);
  const [boardsToBeSolved, setBoardsToBeSolved] = useState([]);

  const [showTutorial, setShowTutorial] = useState(false);

  const [intervalVariation, setIntervalVariation] = useState(0); // [0, 2, 3]

  const [timer, setTimer] = useState(0);

  let aiInterval = useRef(0);
  let intervalIndex = useRef(0);
  const [started, setStarted] = useState(false);

  const [aiSolvedBoard, setAiSolvedBoard] = useState([]);

  const [numberToSolve, setNumberToSolve] = useState(0); // [10, 20, 30]

  const [userSolved, setUserSolved] = useState(false);
  const [aiSolved, setAiSolved] = useState(false);

  // this will be done by the backend
  const createRandomList = useCallback((board_size) => {
    let lst = [];
    for (let i = 0; i < board_size; i++) {
      lst.push(Math.floor(Math.random() * 10));
    }
    return lst;
  }, []);

  let interval = useRef(null);

  useEffect(() => {
    if (started === true) {
      interval.current = setInterval(() => {
        setTimer(timer => timer + 1);
        // let plus_minus = Math.random() < 0.5 ? -1 : 1;
        let variation = Math.floor(Math.random() * intervalVariation + 1);
        if (intervalVariation === 0) {
          intervalIndex.current = intervalIndex.current - 1;
        } else {
          intervalIndex.current = intervalIndex.current - variation;
        }
      }, 1000);
      return () => clearInterval(interval.current);
    }
  }, [started]);

  useEffect(() => {
    if (intervalIndex.current <= 0) {
      if (aiBoard === boardsToBeSolved.length - 1) {
        setAiSolved(true);
      }
      intervalIndex.current = aiInterval.current;
    }
    // console.log('intervalIndex', intervalIndex, 'aiBoard', aiBoard);
  }, [timer]);

  useEffect(() => {
    if (userBoard === boardsToBeSolved.length && boardsToBeSolved.length !== 0) {
      clearInterval(interval.current);
      setUserSolved(true);
    }
  }, [userBoard, boardsToBeSolved]);

  useEffect(() => {
    if (aiBoard === boardsToBeSolved.length && boardsToBeSolved.length !== 0) {
      clearInterval(interval.current);
      setAiSolved(true);
    }
  }, [aiBoard, boardsToBeSolved]);

  const setUpLists = useCallback(() => {
    let board_size = 0;
    let number_to_solve = 0;
    if (difficulty === 'beginner') {
      board_size = 5;
      number_to_solve = 10;
      setNumberToSolve(10);
      setBoardSize(5);
      setIntervalVariation(0);
      aiInterval.current = 10;
      intervalIndex.current = 10;
    } else if (difficulty === 'normal') {
      board_size = 6;
      number_to_solve = 20;
      setNumberToSolve(20);
      setBoardSize(6);
      setIntervalVariation(2);
      aiInterval.current = 8;
      intervalIndex.current = 8;
    } else if (difficulty === 'insane') {
      board_size = 8;
      number_to_solve = 30;
      setNumberToSolve(30);
      setBoardSize(8);
      setIntervalVariation(3);
      aiInterval.current = 5;
      intervalIndex.current = 5;
    }

    let variation = difficulty === 'beginner' ? 0 : difficulty === 'normal' ? 2 : 3;
    if (boardType === 'bubble') {
      let btdslst = []; // boards to be solved list
      for (let i = 0; i < number_to_solve; i++) {
        let slst = [];
        while (slst.length <= 1) {
          let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
          slst = BubbleSort(rlst);
        }
        btdslst.push(slst);
      }
      setSortedLists(btdslst[0]);
      setBoardsToBeSolved(btdslst);
      setRandomList(btdslst[0][0]);
      setBoardSize(btdslst[0][0].length)
    } else if (boardType === 'insertion') {
      let btdslst = []; // boards to be solved list
      for (let i = 0; i < number_to_solve; i++) {
        let slst = [];
        while (slst.length <= 1) {
          let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
          slst = InsertionSort(rlst);
        }
        btdslst.push(slst);
      }
      setSortedLists(btdslst[0]);
      setBoardsToBeSolved(btdslst);
      setRandomList(btdslst[0][0]);
      setBoardSize(btdslst[0][0].length)
    } else if (boardType === 'selection') {
      let btdslst = []; // boards to be solved list
      for (let i = 0; i < number_to_solve; i++) {
        let slst = [];
        while (slst.length <= 1) {
          let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
          slst = SelectionSort(rlst);
        }
        btdslst.push(slst);
      }
      setSortedLists(btdslst[0]);
      setBoardsToBeSolved(btdslst);
      setRandomList(btdslst[0][0]);
      setBoardSize(btdslst[0][0].length)
    }
  }, []);

  useEffect(() => {
    setUpLists();
  }, [setUpLists]);


  function handleCancel() {
    setStarted(false);
    setAiSolvedBoard([]);
    setAiSolved(false);
    setUserSolved(false);
    setUserBoard(0);
    setAiBoard(0);
    setAiScore(0);
    setUserScore(0);
    setTimer(0);
    setRandomList([]);
    setSortedLists([]);
    setBoardsToBeSolved([]);
    clearInterval(interval.current);
    setUpLists();
  }

  function getRandomString() {
    if (aiSolved === true && userSolved === false) {
      return 'You Lost!';
    } else if (aiSolved === false && userSolved === true) {
      return 'You Won!';
    } else if (aiSolved === true && userSolved === true) {
      return 'Tie!';
    } else {
      return 'Game Over!';
    }
  }

  const navigate = useNavigate();

  function handleHelp() {
    setShowTutorial(!showTutorial);
  }

  return (
    <div>
      <div className={styles.main}>
        <div className='top_board'>
          <h1>Difficulty: {difficulty === "beginner" ? "Beginner" : difficulty === "normal" ? "Normal" : "Insane"}</h1>
          <h2>Board Type: {boardType === "bubble" ? "Bubble Sort" : boardType === "insertion" ? "Insertion Sort" : "Selection Sort"}</h2>
        </div>
        <div className={styles.top_btns}>
          {started === true && sortedLists && sortedLists.length !== 0 ? (<div className={styles.cancel_container}> <button className={styles.help_btn} onClick={() => { handleHelp() }}>Help</button> </div>) : null}
          {started === true && sortedLists && sortedLists.length !== 0 ? (<div className={styles.cancel_container}> <button className={styles.cancel_btn} onClick={() => { handleCancel(); props.handleBack() }}>Cancel</button> </div>) : null}
        </div>
        {!showTutorial ? null : <div className={styles.tutorial}>
          <button className={styles.close_tut_btn} onClick={() => handleHelp()}>
            Close
          </button>
          <Tutorial />
        </div>}
        {aiSolved === true || userSolved === true ? (<div className={styles.end_container}>
          <h1>{getRandomString()}</h1>
          <h2>AI Score: {aiScore}</h2>
          <h2>Your Score: {userScore}</h2>
          <h2>Time: {timer} seconds</h2>
          <button className={styles.back_btn} onClick={() => { navigate("/compete"); handleCancel() }}>New Game</button>
          <button className={styles.back_btn} onClick={() => handleCancel()}>Restart</button>
        </div>) : null}
        {started ? null : (<div className={styles.select_container}> <button className={styles.select_btn} onClick={() => setStarted(true)}>Start</button> </div>)}
        {started ? null : (<div className={styles.select_container}> <button className={styles.back_btn} onClick={() => props.handleFinalBack()}>Cancel</button> </div>)}
        {started ? null : (<Tutorial />)}
        {started === true && sortedLists && sortedLists.length !== 0 ? (<div>Timer: {timer} s</div>) : null}
        {started === true && sortedLists && sortedLists.length !== 0 ? (<div className={styles.boards_container}>
          <div className={styles.board}>
            <h1>Your Board</h1>
            <h2>Your Score: {userScore}</h2>
            <CompeteBoard draggable={true} boardSize={boardSize} difficulty={difficulty} boardType={boardType} randomList={randomList} sortedLists={sortedLists} against={'ai'} roomId={'none'} solvedBoard={[]} changeScore={setUserScore} changeBoard={setUserBoard} changeSolved={setUserSolved} boardsToBeSolved={boardsToBeSolved} />
          </div>
          <div className={styles.board}>
            <h1>Opponent's Board</h1>
            <h2>AI Score: {aiScore}</h2>
            <AiBoard draggable={false} timer={timer} boardSize={boardSize} difficulty={difficulty} boardType={boardType} randomList={randomList} sortedLists={sortedLists} solvedBoard={aiSolvedBoard} aiInterval={aiInterval} intervalIndex={intervalIndex} changeScore={setAiScore} changeBoard={setAiBoard} changeSolved={setAiSolved} boardsToBeSolved={boardsToBeSolved} />
          </div>
        </div>) : null}

      </div>
    </div>
  )
}