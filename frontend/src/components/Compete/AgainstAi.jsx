import React, { useState, useEffect, useCallback, useRef } from 'react';

import styles from './Compete.module.css';

import CompeteBoard from '../GameBoards/CompeteBoard';
import AiBoard from '../GameBoards/AiBoard';

import { BubbleSort, InsertionSort, SelectionSort } from '../../algos/Algos';

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

  const [timer, setTimer] = useState(0);
  // const [aiInterval, setAiInterval] = useState(0);
  // const [intervalIndex, setIntervalIndex] = useState(0);
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
        // setIntervalIndex(aiInterval => aiInterval - 1);
        intervalIndex.current = intervalIndex.current - 1;
      }, 1000);
      return () => clearInterval(interval.current);
    }
  }, [started]);

  useEffect(() => {
    if (intervalIndex.current === 0) {
      if (aiBoard === boardsToBeSolved.length - 1) {
        setAiSolved(true);
      }
      intervalIndex.current = aiInterval.current;
    }
    // console.log('intervalIndex', intervalIndex, 'aiBoard', aiBoard);
  }, [timer]);


  useEffect(() => {
    if (aiSolved === true) {
      clearInterval(interval.current);
    }
  }, [aiSolved]);

  useEffect(() => {
    if (userBoard === boardsToBeSolved.length && boardsToBeSolved.length !== 0) {
      setUserSolved(true);
      console.log('user solved');
    }
    console.log('user board changed');
  }, [userBoard, boardsToBeSolved]);

  useEffect(() => {
    let board_size = 0;
    let number_to_solve = 0;
    if (difficulty === 'beginner') {
      board_size = 5;
      number_to_solve = 10;
      setNumberToSolve(10);
      setBoardSize(5);
      // setAiInterval(20);
      // setIntervalIndex(20);
      aiInterval.current = 20;
      intervalIndex.current = 20;
    } else if (difficulty === 'normal') {
      board_size = 6;
      number_to_solve = 20;
      setNumberToSolve(20);
      setBoardSize(6);
      // setAiInterval(10);
      // setIntervalIndex(10);
      aiInterval.current = 10;
      intervalIndex.current = 10;
    } else if (difficulty === 'insane') {
      board_size = 8;
      number_to_solve = 30;
      setNumberToSolve(30);
      setBoardSize(8);
      // setAiInterval(5);
      // setIntervalIndex(5);
      aiInterval.current = 5;
      intervalIndex.current = 5;
    }

    let variation = difficulty === 'beginner' ? 0 : difficulty === 'normal' ? 3 : 5;
    if (boardType === 'bubble') {
      let btdslst = []; // boards to be solved list
      for (let i = 0; i < number_to_solve; i++) {
        let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
        let slst = BubbleSort(rlst);
        btdslst.push(slst);
      }
      setSortedLists(btdslst[0]);
      setBoardsToBeSolved(btdslst);
      setRandomList(btdslst[0][0]);
      setBoardSize(btdslst[0][0].length)
      // console.log("btdbsloved", btdslst);
    } else if (boardType === 'insertion') {
      let btdslst = []; // boards to be solved list
      for (let i = 0; i < number_to_solve; i++) {
        let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
        let slst = InsertionSort(rlst);
        btdslst.push(slst);
      }
      setSortedLists(btdslst[0]);
      setBoardsToBeSolved(btdslst);
      setRandomList(btdslst[0][0]);
      setBoardSize(btdslst[0][0].length)
    } else if (boardType === 'selection') {
      let btdslst = []; // boards to be solved list

      for (let i = 0; i < number_to_solve; i++) {
        let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
        let slst = SelectionSort(rlst);
        btdslst.push(slst);
      }
      setSortedLists(btdslst[0]);
      setBoardsToBeSolved(btdslst);
      setRandomList(btdslst[0][0]);
      setBoardSize(btdslst[0][0].length)
    } else if (boardType === 'merge') {
      // let slst = MergeSort(props.randomList);
      // setSortedLists(slst);
      // setBoardsToBeSolved([slst]);
    }
  }, []);


  return (
    <div>
      <div className={styles.main}>
        <h1>AgainstAi</h1>
        {started ? null : (<div className={styles.select_container}> <button className={styles.select_btn} onClick={() => setStarted(true)}>Start</button> </div>)}
        {started === true && sortedLists && sortedLists.length !== 0 ? (<div>{timer}</div>) : null}
        {started === true && sortedLists && sortedLists.length !== 0 ? (<div className={styles.boards_container}>
          <div className={styles.board}>
            <h1>Your Board</h1>
            <h2>Your Score: {userScore}</h2>
            <CompeteBoard draggable={true} boardSize={boardSize} difficulty={difficulty} boardType={boardType} randomList={randomList} sortedLists={sortedLists} solvedBoard={[]} changeScore={setUserScore} changeBoard={setUserBoard} changeSolved={setUserSolved} boardsToBeSolved={boardsToBeSolved} />
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