import React from 'react';

export default function NonSortableItem(props) {

  return (
    <div className='game_piece'>
      {props.value}
    </div>
  );
}