import React, { useState, useEffect } from 'react';
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from "@dnd-kit/utilities";

function GamePiece(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <button ref={setNodeRef} style={style} className='game_piece' {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

function GameBox(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className='game_box'>
      {props.children}
    </div>
  );

}

export default function GameBoard(props) {
  const [randomList, setRandomList] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [sortedLists, setSortedLists] = useState([]);
  const [gameBoxes, setGameBoxes] = useState([]);
  const [gamePieces, setGamePieces] = useState([]);

  const [piecesPlaced, setPiecesPlaced] = useState(0);

  // this will be done by the backend
  function createRandomList() {
    let lst = [];
    for (let i = 0; i < props.boardSize; i++) {
      lst.push(Math.floor(Math.random() * 10));
    }
    return lst;
  }

  function sortList(sortingAlgorithm, rlst = currentList) {
    let lst = [rlst];
    let arr = [...rlst];
    if (sortingAlgorithm === 'bubbleSort') {
      // do bubblesort but save at each step
      for (var i = 0; i < arr.length; i++) {

        // Last i elements are already in place   
        for (var j = 0; j < (arr.length - i - 1); j++) {

          // Checking if the item at present iteration  
          // is greater than the next iteration 
          if (arr[j] > arr[j + 1]) {

            // If the condition is true 
            // then swap them 
            var temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
        lst.push([...arr]);
      }
    }
    console.log(lst);
    setSortedLists(lst);
    return lst;
  }

  useEffect(() => {
    let rlst = createRandomList();
    setRandomList(rlst);
    setCurrentList(rlst);
    let slst = sortList('bubbleSort', rlst);
    createGameBoxes(slst);
    createGamePieces(rlst);
  }, []);

  function handleDragEnd(event) {
    const { active, over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    console.log(over);
    console.log(active);
  }

  function handleDrop(event) {
    const { over } = event;
    console.log(over);
    console.log(event);
  }

  function createGamePieces(lst) {
    let gamePieces = [];
    for (let i = 0; i < lst.length; i++) {
      gamePieces.push(<GamePiece id={i + 1}>{lst[i]}</GamePiece>);
    }
    setGamePieces(gamePieces);
    return gamePieces;
  }

  function createGameBoxes(lst) {
    let gameBoxes = [];
    for (let i = 0; i < lst.length; i++) {
      for (let j = 0; j < lst[0].length; j++) {
        gameBoxes.push(<GameBox id={`${i}${j}`}>{"X"}</GameBox>);
      }
    }
    setGameBoxes(gameBoxes);
    return gameBoxes;
  }

  const [boardStyle, setBoardStyle] = useState({
    width: (props.boardSize * 80 + (props.boardSize - 1) * 5) + 'px',
    height: sortedLists && sortedLists.length ? (sortedLists.length * 80 + (sortedLists.length - 1) * 5) + 'px' : (props.boardSize * 80 + (props.boardSize - 1) * 5) + 'px',
    display: "grid",
    "grid-template-columns": "repeat(" + props.boardSize + ", 80px)",
    gap: "5px 5px",
  });

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={boardStyle}>
        {(gamePieces && gamePieces.length !== 0) ? (gamePieces) : null}
        {(gameBoxes && gameBoxes.length !== 0) ? (gameBoxes) : null}
      </div>
    </DndContext>
  )
}