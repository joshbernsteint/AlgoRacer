class Algorithm{
    constructor(max_steps, speed){
        this.started = false;
        this.current_step = 0;
        this.max_steps = max_steps;
        this.speed = speed;
        this.complete = false;
    }

    advance(){
        if(!this.complete){
            this.started = true;
            this.current_step++;
            if(this.current_step > this.max_steps){
                this.complete = true;
            }
        }
    }

    isDone(){
        return this.complete;
    }
}

export{
    Algorithm
}