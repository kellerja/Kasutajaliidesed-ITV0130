let TaskState = {
    NOT_STARTED: 0,
    RUNNING: 100,
    COMPLETED: 200,
    FAILED: 400
}

var tempDragObject = null;

class Player {
    constructor(gameOverCallback) {
        this.lives = 3;
        this.score = 0;
        this.gameOverEvent = gameOverCallback;
    }

    deltaLives(delta) {
        this.lives += delta;
        if (this.lives <= 0) {
            this.gameOverEvent && this.gameOverEvent(this.score);
        }
    }

    deltaScore(delta) {
        this.score += delta;
    }

    applyReward(reward) {
        this.deltaScore(reward.deltaScore);
        this.deltaLives(reward.deltaLives);
    }
}

class Bin {
    constructor(identifier, imageUrl, contentUrls)  {
        this.id = identifier;
        this.imageUrl = imageUrl;
        this.contentUrls = contentUrls;
    }

    drop(event, bin, player) {
        if (!(tempDragObject instanceof DraggableTask)) {
            return;
        }
        tempDragObject.run(bin, player);
    }
}

class Reward {
    constructor(deltaLives, deltaScore) {
        this.deltaLives = deltaLives;
        this.deltaScore = deltaScore;
    }
}

class Task {
    constructor(taskCompleteCallback) {
        this.state = TaskState.NOT_STARTED;
        this.score = 1;
        this.id = Math.random();
        this.taskCompleteEvent = taskCompleteCallback;
        this.animation = 'animation: 500s linear 0s 1 timer';
        this.isValid = true;
    }

    start() {
        this.state = TaskState.RUNNING;
    }

    run(target, player) {
    }

    finish() {}

    timeout() {
        this.state = TaskState.FAILED;
        this.taskCompleteEvent(this, new Reward(-1, 0));
    }
}

class DraggableTask extends Task {
    constructor(taskCompleteCallback) {
        super(taskCompleteCallback);
    }

    drag(event, task) {
        tempDragObject = task;
    }

    dragStop(event) {
        tempDragObject = null;
    }
}

Vue.component('calculate-task-component', {
    template: '<div class="paper"> \
                    <p>Find x:<br> {{task.challenge.formula}}</p> \
                    <input type="number" class="w-100" v-model="guess"> \
                    <button @click="task.run(guess)" class="btn w-100">Send</button> \
                </div>',
    props: ['task', 'gameOver'],
    data: function() {
        return {
            guess: '',
            animation: false
        };
    }
});

Vue.component('draggable-task-component', {
    template: '<img class="paper" :style="gameOver ? \'cursor: default;\' : \'cursor: move;\'" :src="task.imageUrl" :draggable="!gameOver" @dragstart="task.drag($event, task)" \
                @dragend="task.dragStop">',
    props: ['task', 'gameOver']
})

Vue.component('task-component', {
    template: '<draggable-task-component :task="task" :gameOver="gameOver" v-if="isDraggableTask" \
                    :style="animation ? task.animation + (gameOver ? \' paused;\' : \'\') : \'\'" \
                    @animationend="timeOut"></draggable-task-component> \
                <calculate-task-component :task="task" :gameOver="gameOver" v-else \
                    :style="animation ? task.animation + (gameOver ? \' paused;\' : \'\') : \'\'" \
                    @animationend="timeOut"></calculate-task-component>',
    props: ['task', 'gameOver'],
    computed: {
        isDraggableTask: function() {
            return this.task instanceof DraggableTask;
        }
    },
    data: function() {
        return {
            animation: false
        };
    },
    methods: {
        timeOut: function(event) {
            this.task.timeout();
        }
    },
    mounted: function() {
        this.animation = true;
        this.task.start();
    },
    beforeDestroy: function() {
        this.animation = false;
    }
});

class SortingTask extends DraggableTask {
    constructor(correctBin, taskCompleteCallback) {
        super(taskCompleteCallback);
        this.correctBin = correctBin;
        this.imageUrl = correctBin.contentUrls[Math.floor(Math.random() * correctBin.contentUrls.length)];
    }

    run(target, player) {
        if (!this.isValid || !(target instanceof Bin)) {
            return;
        }
        if (this.correctBin === target) {
            this.state = TaskState.COMPLETED;
            this.taskCompleteEvent(this, new Reward(0, this.score));
        } else {
            this.state = TaskState.FAILED;
            this.taskCompleteEvent(this, new Reward(-1, 0));
        }
    }
}

class CalculationTask extends Task {
    constructor(taskCompleteCallback) {
        super(taskCompleteCallback);
        this.challenge = {
            formula: '6 + 5 = x',
            correct: 11
        }
    }

    run(target, player) {
        let playerGuess = Number.parseFloat(target);
        if (isNaN(playerGuess)) return;
        if (Math.abs(playerGuess - this.challenge.correct) < 10e-3) {
            this.state = TaskState.COMPLETED;
            this.taskCompleteEvent(this, new Reward(0, this.score));
        } else {
            this.state = TaskState.FAILED;
            this.taskCompleteEvent(this, new Reward(-1, 0));
        }
    }
}

let valuableAssets = [
    '/assets/diamond.svg',
    '/assets/engagement-ring.svg',
    '/assets/Gold_Block_clip_art.svg',
    '/assets/gold.svg',
    '/assets/jewel.svg',
    '/assets/coin-stack.svg',
    '/assets/money-bag.svg',
    '/assets/money-svgrepo-com.svg',
];

let trashAssets = [
    '/assets/wrench.svg'
];

let bioTrashAssets = [
    '/assets/Tux_Paint_banana.svg'
];

class Game {
    constructor() {
        this.bins = [new Bin(1, '/assets/recycle-bin-interface-symbol.svg', bioTrashAssets), 
                     new Bin(2, '/assets/delete.svg', trashAssets), 
                     new Bin(3, '/assets/money-bag-2.svg', valuableAssets)];
        this.numOfSortingTasks = 2;
        this.restart();
    }

    gameOverCallback(score) {
        this.isGameOver = true;
    }

    taskCompleteCallback(task, reward) {
        this.player.applyReward(reward);
        let taskIndex = this.tasks.indexOf(task);
        this.tasks[taskIndex].isValid = false;
        this.tasks.splice(taskIndex, 1, this.generateNewSortingTask());
    }

    generateNewSortingTask() {
        return new SortingTask(this.bins[Math.floor(Math.random() * this.bins.length)],
                                (res, reward) => this.taskCompleteCallback(res, reward));
    }

    generateCalculationTask() {
        return new CalculationTask((res, reward) => this.taskCompleteCallback(res, reward));
    }

    restart() {
        this.isGameOver = false;
        this.player = new Player((score) => this.gameOverCallback(score));
        this.tasks = Array.from({length: this.numOfSortingTasks}, () => this.generateNewSortingTask());
    }
}

let vm = new Vue({
    el: '#game',
    data: {
        game: new Game()
    },
    methods: {}
});
