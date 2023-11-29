function BubbleSort(rlst) {
  let lst = [rlst];
  let arr = [...rlst];
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
  // console.log(rlst);
  // console.log(lst);
  return lst;
}

function InsertionSort(rlst) {
  let lst = [rlst];
  let arr = [...rlst];
  // do insertionsort but save at each step
  let i, key, j;
  for (i = 1; i < arr.length; i++) {
    key = arr[i];
    j = i - 1;
    while (j >= 0 && arr[j] > key) { // if arr[j] > key, then move arr[j] to the right
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key; // put key in the right spot
    lst.push([...arr]);
  }
  return lst;
}

function SelectionSort(rlst) {
  let lst = [rlst];
  let arr = [...rlst];
  // do selectionsort but save at each step
  let i, j, min_idx;

  // One by one move boundary of unsorted subarray
  for (i = 0; i < arr.length - 1; i++) {
    // Find the minimum element in unsorted array
    min_idx = i;
    for (j = i + 1; j < navigator; j++) {
      if (arr[j] < arr[min_idx]) {
        min_idx = j;
      }
    }
    // Swap the found minimum element with the first element
    let temp = arr[min_idx];
    arr[min_idx] = arr[i];
    arr[i] = temp;
    lst.push([...arr]);
  }
  return lst;
}

module.exports = {
  BubbleSort,
  InsertionSort,
  SelectionSort
};