import React, { useState, useEffect, useCallback, useRef } from 'react';

import styles from './Compete.module.css';

import axios from 'axios';

import CompeteBoardEndless from '../GameBoards/Endless/CompeteBoardEndless';
import AiBoardEndless from '../GameBoards/Endless/AiBoardEndless';

import { BubbleSort, InsertionSort, SelectionSort } from '../../algos/Algos';
import { useNavigate } from 'react-router-dom';

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

  const [intervalVariation, setIntervalVariation] = useState(0); // [0, 2, 3]

  const [timer, setTimer] = useState(0);

  let aiInterval = useRef(0);
  let intervalIndex = useRef(0);
  const [started, setStarted] = useState(false);

  const [aiSolvedBoard, setAiSolvedBoard] = useState([]);

  const [userSolved, setUserSolved] = useState(false);
  const [aiSolved, setAiSolved] = useState(false);

  const [speed, setSpeed] = useState(1);
  const [speedUp, setSpeedUp] = useState(0);

  // this will be done by the backend
  const createRandomList = useCallback((board_size) => {
    let lst = [];
    for (let i = 0; i < board_size; i++) {
      lst.push(Math.floor(Math.random() * 10));
    }
    return lst;
  }, []);

  let interval = useRef(null);

  let boardsToSolve = useRef([]);

  useEffect(() => {
    if (started === true) {
      interval.current = setInterval(() => {
        setTimer(timer => timer + 1);
        intervalIndex.current = intervalIndex.current - 1;
      }, 1000);
      return () => clearInterval(interval.current);
    }
  }, [started]);

  useEffect(() => {
    if (intervalIndex.current <= 0) {
      intervalIndex.current = aiInterval.current;
    }
  }, [timer]);

  useEffect(() => {
    async function sendData() {
      if (aiBoard > userBoard) {
        const diff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        if (props.userData) {
          const { data } = await axios.post(`https://algoracer-backend-5bed1a87253c.herokuapp.com/leaderboard/add/${props.userData.id}`, {
            name: boardType === "bubble" ? "Bubble Sort" : boardType === "insertion" ? "Insertion Sort" : "Selection Sort",
            time_taken: timer,
            got_score: userScore,
            timestamp: Date.now(),
            difficulty: diff
          });
          await axios.post(`https://algoracer-backend-5bed1a87253c.herokuapp.com/user/stats/${props.userData.id}`, {
            difficulty: diff,
            time_taken: timer,
            got_score: userScore,
          });
        }
        clearInterval(interval.current);
        setAiSolved(true);
      }
    }
    sendData();
  }, [aiBoard, userBoard]);

  useEffect(() => {
    let board_size = boardSize;
    if (userBoard === boardsToSolve.current.length - 2 && userBoard > 7) {
      let variation = difficulty === 'beginner' ? 0 : difficulty === 'normal' ? 1 : 2;
      if (boardType === 'bubble') {
        let btdslst = []; // boards to be solved list
        for (let k = 0; k < 10; k++) {
          let slst = [];
          while (slst.length <= 2) {
            let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
            slst = BubbleSort(rlst);
          }
          btdslst.push(slst);
        }
        boardsToSolve.current = ([...boardsToSolve.current, ...btdslst]);
      } else if (boardType === 'insertion') {
        let btdslst = []; // boards to be solved list
        for (let k = 0; k < 10; k++) {
          let slst = [];
          while (slst.length <= 2) {
            let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
            slst = InsertionSort(rlst);
          }
          btdslst.push(slst);
        }
        boardsToSolve.current = ([...boardsToSolve.current, ...btdslst]);
      } else if (boardType === 'selection') {
        let btdslst = []; // boards to be solved list
        let slst = [];
        for (let k = 0; k < 10; k++) {
          while (slst.length <= 2) {
            let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
            slst = SelectionSort(rlst);
          }
          btdslst.push(slst);
        }
        boardsToSolve.current = ([...boardsToSolve.current, ...btdslst]);
      }
    }
    if (userBoard !== 0) {
      const useSpeed = speed + speedUp;
      aiInterval.current = aiInterval.current - (aiInterval.current * (useSpeed / 100))
      setSpeed(useSpeed);
    }
  }, [userBoard]);

  const setUpLists = useCallback(() => {
    let board_size = 0;
    if (difficulty === 'beginner') {
      board_size = 5;
      setBoardSize(5);
      setSpeedUp(0.5);
      aiInterval.current = 30;
      intervalIndex.current = 30;
    } else if (difficulty === 'normal') {
      board_size = 6;
      setBoardSize(8);
      setSpeedUp(1);
      aiInterval.current = 20;
      intervalIndex.current = 20;
    } else if (difficulty === 'insane') {
      board_size = 8;
      setBoardSize(10);
      setSpeedUp(10);
      aiInterval.current = 10;
      intervalIndex.current = 10;
    }

    let variation = difficulty === 'beginner' ? 0 : difficulty === 'normal' ? 2 : 3;
    if (boardType === 'bubble') {
      let btdslst = []; // boards to be solved list
      for (let k = 0; k < 10; k++) {
        let slst = [];
        while (slst.length <= 2) {
          let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
          slst = BubbleSort(rlst);
        }
        btdslst.push(slst);
      }
      setSortedLists(btdslst[0]);
      // setBoardsToBeSolved(btdslst);
      boardsToSolve.current = btdslst;
      setRandomList(btdslst[0][0]);
      setBoardSize(btdslst[0][0].length)
    } else if (boardType === 'insertion') {
      let btdslst = []; // boards to be solved list
      for (let k = 0; k < 10; k++) {
        let slst = [];
        while (slst.length <= 2) {
          let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
          slst = InsertionSort(rlst);
        }
        btdslst.push(slst);
      }
      setSortedLists(btdslst[0]);
      // setBoardsToBeSolved(btdslst);
      boardsToSolve.current = btdslst;
      setRandomList(btdslst[0][0]);
      setBoardSize(btdslst[0][0].length);
    } else if (boardType === 'selection') {
      let btdslst = []; // boards to be solved list
      let slst = [];
      for (let k = 0; k < 10; k++) {
        while (slst.length <= 2) {
          let rlst = createRandomList(Math.floor(board_size - (Math.random() * variation)));
          slst = SelectionSort(rlst);
        }
        btdslst.push(slst);
      }
      setSortedLists(btdslst[0]);
      // setBoardsToBeSolved(btdslst);
      boardsToSolve.current = btdslst;
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
    setSpeed(0);
    setSpeedUp(0);
    // setBoardsToBeSolved([]);
    boardsToSolve.current = [];
    clearInterval(interval.current);
    setUpLists();
  }

  function getRandomString() {
    let random_strings = ["The bot has solved all the boards!", "The bot has bested you!", "Kneel before your bot god!", "Better luck next time, champ!", "Surely you can do better than that!"]
    let random_index = Math.floor(Math.random() * random_strings.length);
    return random_strings[random_index];
  }

  // console.log(props.userData);
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.main}>
        <div className='top_board'>
          <h1>Difficulty: {difficulty === "beginner" ? "Beginner" : difficulty === "normal" ? "Normal" : "Insane"}</h1>
          <h2>Board Type: {boardType === "bubble" ? "Bubble Sort" : boardType === "insertion" ? "Insertion Sort" : "Selection Sort"}</h2>
        </div>
        {aiSolved === true ? (<div className={styles.end_container}>
          <h1>{getRandomString()}</h1>
          <h2>AI Score: {aiScore}</h2>
          <h2>Your Score: {userScore}</h2>
          <h2>Time: {timer} seconds</h2>
          <button className={styles.back_btn} onClick={() => { navigate("/compete"); handleCancel() }}>New Game</button>
          <button className={styles.back_btn} onClick={() => handleCancel()}>Restart</button>
        </div>) : null}

        {started ? null : (<div className={styles.select_container}> <button className={styles.select_btn} onClick={() => setStarted(true)}>Start</button> </div>)}
        {started ? null : (<div className={styles.select_container}> <button className={styles.back_btn} onClick={() => props.handleFinalBack()}>Cancel</button> </div>)}
        {started === true && sortedLists && sortedLists.length !== 0 ? (<div> Speedup: {speed.toFixed(2)} % </div>) : null}
        {started === true && sortedLists && sortedLists.length !== 0 ? (<div> Current Speed: {aiInterval.current.toFixed(2)} s </div>) : null}
        {started === true && sortedLists && sortedLists.length !== 0 ? (<div>Timer: {timer} s</div>) : null}
        {started === true && sortedLists && sortedLists.length !== 0 ? (<div className={styles.boards_container}>
          <div className={styles.board}>
            <h1>Your Board</h1>
            <h2>Your Score: {userScore}</h2>
            <CompeteBoardEndless draggable={true} boardSize={boardSize} difficulty={difficulty} boardType={boardType} randomList={randomList} sortedLists={sortedLists} against={'ai'} roomId={'none'} solvedBoard={[]} changeScore={setUserScore} changeBoard={setUserBoard} changeSolved={setUserSolved} boardsToBeSolved={boardsToSolve} />
          </div>
          <div className={styles.board}>
            <h1>Opponent's Board</h1>
            <h2>AI Score: {aiScore}</h2>
            <AiBoardEndless draggable={false} timer={timer} boardSize={boardSize} difficulty={difficulty} boardType={boardType} randomList={randomList} sortedLists={sortedLists} solvedBoard={aiSolvedBoard} aiInterval={aiInterval} intervalIndex={intervalIndex} changeScore={setAiScore} changeBoard={setAiBoard} changeSolved={setAiSolved} boardsToBeSolved={boardsToSolve} />
          </div>
        </div>) : null}
        {started === true && sortedLists && sortedLists.length !== 0 ? (<div className={styles.cancel_container}> <button className={styles.back_btn} onClick={() => { handleCancel(); props.handleBack() }}>Cancel</button> </div>) : null}
      </div>
    </div>
  )
}