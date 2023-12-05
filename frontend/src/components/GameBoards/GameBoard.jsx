import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';

import SortableItem from './SortableItem';

import { BubbleSort, InsertionSort, SelectionSort } from '../../algos/Algos';

export default function GameBoard(props) {
  const [sortedLists, setSortedLists] = useState([]);
  const [boardType, setBoardType] = useState(props.boardType);
  const [difficulty, setDifficulty] = useState(props.difficulty);
  const [indexToSolve, setIndexToSolve] = useState(1);
  const [randomList, setRandomList] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [currentListObj, setCurrentListObj] = useState([]);
  const [mergeList, setMergeList] = useState([]);
  const [boardStyle, setBoardStyle] = useState({
    width: (props.boardSize * 80 + (props.boardSize - 1) * 5) + 'px',
    display: "grid",
    "gridTemplateColumns": "repeat(" + props.boardSize + ", 80px)",
    gap: "5px 5px",
  });
  const [solvedBoard, setSolvedBoard] = useState([]);
  const [boardsSolved, setBoardsSolved] = useState(0);

  const [timer, setTimer] = useState(0);

  const [started, setStarted] = useState(true);

  const interval = useRef(null);

  useEffect(() => {
    if (started === true) {
      interval.current = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
      return () => clearInterval(interval.current);
    }
  }, [started]);

  const createRandomList = useCallback((boardLen) => {
    let lst = [];
    for (let i = 0; i < boardLen; i++) {
      lst.push(Math.floor(Math.random() * 10));
    }
    return lst;
  }, []);

  const sortList = useCallback((sortingAlgorithm, rlst) => {
    let lst = [];
    if (sortingAlgorithm === 'bubble') {
      lst = BubbleSort(rlst);
    } else if (sortingAlgorithm === 'insertion') {
      lst = InsertionSort(rlst);
    } else if (sortingAlgorithm === 'selection') {
      lst = SelectionSort(rlst);
    } else {
      lst = rlst;
    }
    setSortedLists(lst);
    return lst;
  }, []);

  const mergeLstIds = useCallback((lst) => {
    let merged = [];
    for (let i = 0; i < lst.length; i++) {
      merged.push(lst[i].id);
    }
    return merged;
  }, []);

  const mergeCurrMergeLsts = useCallback((lst) => {
    let merged = [];
    for (let i = 0; i < lst.length; i++) {
      let obj = { id: `${i + 1}${lst[i]}`, value: lst[i] };
      merged.push(obj);
    }
    return merged;
  }, []);

  const setUpBoard = useCallback(() => {
    let boardLen = 0;
    if (difficulty === 'beginner') {
      boardLen = 5;
    } else if (difficulty === 'normal') {
      boardLen = Math.floor(5 + (Math.random() * 3));
    } else {
      boardLen = Math.floor(5 + (Math.random() * 5));
    }
    let rlst = createRandomList(boardLen);
    setRandomList(rlst);
    let slst = sortList(boardType, rlst);
    // console.log('slst: ', slst);
    setCurrentList(slst[indexToSolve]);
    let obj = mergeCurrMergeLsts(rlst);
    setCurrentListObj(obj);
    setSortedLists(slst);
    setMergeList(mergeLstIds(obj));
    setSolvedBoard([]);
    setBoardStyle({
      width: (boardLen * 80 + (boardLen - 1) * 5) + 'px',
      display: "grid",
      "gridTemplateColumns": "repeat(" + (boardLen) + ", 80px)",
      gap: "5px 5px",
    });
  }, []);

  useEffect(() => {
    setUpBoard();
  }, [setUpBoard]);

  useEffect(() => {
    let checkLst = currentList;
    let toBeChecked = [];
    for (let i = 0; i < currentListObj.length; i++) {
      toBeChecked.push(currentListObj[i].value);
    }
    if (toBeChecked.length !== 0) {
      let isCorrect = true;
      for (let i = 0; i < checkLst.length; i++) {
        if (checkLst[i] !== toBeChecked[i]) {
          isCorrect = false;
          break;
        }
      }

      if (isCorrect) {
        if (indexToSolve === sortedLists.length - 1) {
          setSolvedBoard([]);
          setIndexToSolve(1);
          setRandomList([]);
          setSortedLists([]);
          setCurrentList([]);
          setCurrentListObj([]);
          setMergeList([]);
          setBoardsSolved(boardsSolved + 1);
          setUpBoard();
        } else {
          setSolvedBoard([...solvedBoard, currentList]);
          setCurrentList(sortedLists[indexToSolve + 1]);
          setIndexToSolve(indexToSolve + 1);
        }
      }
    }
    setMergeList(mergeLstIds(currentListObj));
  }, [currentListObj]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCurrentListObj((currentListObj) => {
        let oldIndex = 0;
        let newIndex = 0;

        for (let i = 0; i < currentListObj.length; i++) {
          if (currentListObj[i].id === active.id) {
            oldIndex = i;
          } else if (currentListObj[i].id === over.id) {
            newIndex = i;
          }
        }
        return arrayMove(currentListObj, oldIndex, newIndex);
      });
    }
  }

  function resetRow() {
    let previousList = [];
    if (solvedBoard.length === 0) {
      previousList = randomList;
    } else {
      previousList = solvedBoard[solvedBoard.length - 1];
    }
    setCurrentListObj(mergeCurrMergeLsts(previousList));
    setMergeList(mergeLstIds(mergeCurrMergeLsts(previousList)));
  }

  function keepRow() {
    let previousList = [];
    if (solvedBoard.length === 0) {
      previousList = randomList;
    } else {
      previousList = solvedBoard[solvedBoard.length - 1];
    }
    setCurrentListObj(mergeCurrMergeLsts(previousList));
    setMergeList(mergeLstIds(mergeCurrMergeLsts(previousList)));
    setCurrentList(sortedLists[indexToSolve]);
  }

  function formatSolvedBoard(lst, i) {
    let formatted = [];
    for (let j = 0; j < lst.length; j++) {
      let item = <div key={`${i}${j}`} className='game_piece_done'>{lst[j]}</div>;
      formatted.push(item);
    }
    return formatted;
  }

  return (
    <div className='game_board'>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="top_board">
          <div className="score">
            Boards Solved: {boardsSolved}
          </div>
          {started ? <div className="timer">
            Timer: {timer} s
          </div> : null}
        </div>
        <div style={boardStyle}>
          {solvedBoard && solvedBoard.length !== 0 ? solvedBoard.map((value, index) => {
            return (
              formatSolvedBoard(value, index).map((val) => {
                return val;
              })
            )
          }) : null}
          <SortableContext items={mergeList} collisionDetection={closestCenter} strategy={horizontalListSortingStrategy}>
            {currentListObj && currentListObj.length !== 0 ? currentListObj.map((value, index) => <SortableItem key={value.id} id={value.id} value={value.value} />) : null}
          </SortableContext>
          <button className='game_piece reset_btn' onClick={() => resetRow()}>Reset Row</button>
          <button className='game_piece keep_btn' onClick={() => keepRow()}>No Diff</button>
        </div>
      </DndContext>
    </div>
  )
}