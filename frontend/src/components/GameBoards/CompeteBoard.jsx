import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';

import SortableItem from './SortableItem';

export default function CompeteBoard(props) {
  /*
  props: {
    boardSize: int
    difficulty: string
    boardType: string
    randomList: list
    sortedLists: list of lists
  }
  */
  const [gamePieces, setGamePieces] = useState([]);
  const [sortedLists, setSortedLists] = useState([]);
  const [indexToSolve, setIndexToSolve] = useState(0);
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

  // this will be done by the backend
  const createRandomList = useCallback(() => {
    let lst = [];
    for (let i = 0; i < props.boardSize; i++) {
      lst.push(Math.floor(Math.random() * 10));
    }
    return lst;
  }, [props.boardSize]);

  const sortList = useCallback((sortingAlgorithm, rlst) => {
    let lst = [];
    let arr = [...rlst];
    if (sortingAlgorithm === 'bubbleSort') {
      // do bubblesort but save at each step
      for (var i = 0; i < arr.length; i++) {
        // Last i elements are already in place
        let swapped = false;
        for (var j = 0; j < (arr.length - i - 1); j++) {
          // Checking if the item at present iteration  
          // is greater than the next iteration 
          if (arr[j] > arr[j + 1]) {
            // If the condition is true 
            // then swap them 
            var temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
            swapped = true;
          }
        }
        if (!swapped) {
          break;
        }
        lst.push([...arr]);
      }
    }
    console.log(lst);
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
    let rlst = createRandomList();
    setRandomList(rlst);
    let slst = sortList('bubbleSort', rlst);
    setCurrentList(slst[indexToSolve]);
    let obj = mergeCurrMergeLsts(rlst);
    setCurrentListObj(obj);
    setSortedLists(slst);
    setMergeList(mergeLstIds(obj));
    setSolvedBoard([]);
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
          // alert("You win!");
          setSolvedBoard([]);
          setIndexToSolve(0);
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
          // console.log("oldIndex: ", oldIndex);
          // console.log("newIndex: ", newIndex);
          return arrayMove(currentListObj, oldIndex, newIndex);
        });
      }
    }
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
        <div className="score">
          Boards Solved: {boardsSolved}
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
        </div>
      </DndContext>
    </div>
  )
}