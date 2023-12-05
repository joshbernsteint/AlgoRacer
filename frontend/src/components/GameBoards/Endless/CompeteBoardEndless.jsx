import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';

import SortableItem from '../SortableItem';
import NonSortableItem from '../NonSortableItem';

/*
props: {
  boardSize: int
  difficulty: string
  boardType: string
  randomList: list
  sortedLists: list of lists
  solvedBoard: list of lists
  changeScore: function
  changeBoard: function
  draggable: boolean
  against: string
  roomId: string
  boardsToBeSolved: list of lists
  solvedBoard: list of lists
}
*/
export default function CompeteBoardEndless(props) {
  const [sortedLists, setSortedLists] = useState(props.sortedLists);
  const [indexToSolve, setIndexToSolve] = useState(1);
  const [randomList, setRandomList] = useState(props.randomList);
  const [currentList, setCurrentList] = useState([]);
  const [currentListObj, setCurrentListObj] = useState([]);
  const [mergeList, setMergeList] = useState([]);

  const [boardStyle, setBoardStyle] = useState({
    width: (props.boardSize * 80 + (props.boardSize - 1) * 5) + 'px',
    display: "grid",
    "gridTemplateColumns": "repeat(" + (props.boardSize) + ", 80px)",
    gap: "5px 5px",
  });

  const [solvedBoard, setSolvedBoard] = useState(props.solvedBoard);
  const [boardsSolved, setBoardsSolved] = useState(0);
  const [boardsToBeSolved, setBoardsToBeSolved] = useState(props.boardsToBeSolved);

  const [done, setDone] = useState(false);

  const setUpBoard = useCallback(() => {
    setCurrentList(sortedLists[indexToSolve]);
    let obj = mergeCurrMergeLsts(randomList);
    setCurrentListObj(obj);
    setMergeList(mergeLstIds(obj));
    setSolvedBoard([]);
  }, []);

  const updateBoard = useCallback((boards) => {
    setCurrentList(boardsToBeSolved.current[boards][indexToSolve]);
    let obj = mergeCurrMergeLsts(boardsToBeSolved.current[boards][0]);
    setRandomList(boardsToBeSolved.current[boards][0]);
    setCurrentListObj(obj);
    setSortedLists(boardsToBeSolved.current[boards]);
    setMergeList(mergeLstIds(obj));
    let len_of_board = boardsToBeSolved.current[boards][indexToSolve].length;
    setBoardStyle({
      width: (len_of_board * 80 + (len_of_board - 1) * 5) + 'px',
      display: "grid",
      "gridTemplateColumns": "repeat(" + (len_of_board) + ", 80px)",
      gap: "5px 5px",
    });
  }, []);

  useEffect(() => {
    setUpBoard();
  }, [setUpBoard]);

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
          let boards = boardsSolved + 1;
          if (boards >= boardsToBeSolved.current.length) {
            setDone(true);
            setSolvedBoard([]);
            setIndexToSolve(0);
            setRandomList([]);
            setSortedLists([]);
            setCurrentList([]);
            setCurrentListObj([]);
            setMergeList([]);
            props.changeScore(boards);
            setBoardsSolved(boards);
            props.changeBoard(boards);
          } else {
            setSolvedBoard([]);
            setIndexToSolve(1);
            setRandomList([]);
            setSortedLists([]);
            setCurrentList([]);
            setCurrentListObj([]);
            setMergeList([]);
            props.changeScore(boards);
            setBoardsSolved(boards);
            props.changeBoard(boards);
            updateBoard(boards);
          }
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
    if (!over || !active) {
      return;
    } else {
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
        <div style={boardStyle}>
          {solvedBoard && solvedBoard.length !== 0 ? solvedBoard.map((value, index) => {
            return (
              formatSolvedBoard(value, index).map((val) => {
                return val;
              })
            )
          }) : null}
          {props.draggable === true ?
            (<SortableContext items={mergeList} collisionDetection={closestCenter} strategy={horizontalListSortingStrategy}>
              {currentListObj && currentListObj.length !== 0 ? currentListObj.map((value, index) => <SortableItem key={value.id} id={value.id} value={value.value} />) : null}
            </SortableContext>) : (
              currentListObj && currentListObj.length !== 0 ? currentListObj.map((value, index) => <NonSortableItem key={value.id} id={value.id} value={value.value} />) : null
            )}
          <button className='game_piece reset_btn' onClick={() => resetRow()}>Reset Row</button>
          <button className='game_piece keep_btn' onClick={() => keepRow()}>No Diff</button>
        </div>
        {done ? <h2>Done</h2> : null}
      </DndContext>
    </div>
  )
}