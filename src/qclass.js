class Queue { 
    constructor() { 
        if (!Queue.instance) { 
            this.items = []; 
            Queue.instance = this; 
        } 
        return Queue.instance; 
    } 
    enqueue(item) { 
        this.items.push(item); 
    }

    dequeue() { 
        return this.items.shift(); 
    } 
    
    isEmpty() { 
        return this.items.length === 0; 
    }
    } 

    
export const receiveQueue = new Queue(); // type 3
export const responseQueue = new Queue();// 
    
