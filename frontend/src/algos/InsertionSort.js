import {Algorithm } from "./Algorithm.js"

class InsertionSort extends Algorithm{
    constructor(max_steps, speed){
        super(max_steps, speed);
    }

    run(list){
        let j;
        console.log("Before: ",list);
        for(let i = 1; i < list.length; i++){
            const value = list[i];
            for( j = i - 1; j >= 0 && list[j] > value; j--){
                list[j+1] = list[j];
            }
            list[j+1] = value;
        }
        console.log("After: ",list);

    }
}

export{
    InsertionSort
}