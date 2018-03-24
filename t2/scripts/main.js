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
    constructor(identifier)  {
        this.id = identifier;
    }

    drop(event, bin, player) {
        if (!(tempDragObject instanceof Task)) {
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
        this.animation = 'animation: 5s linear 0s 1 timer';
    }

    start() {
        this.state = TaskState.RUNNING;
    }

    run(target, player) {
    }

    finish() {}

    drag(event, task) {
        tempDragObject = task;
    }

    dragStop(event) {
        tempDragObject = null;
    }

    timeout() {
        this.state = TaskState.FAILED;
        this.taskCompleteEvent(this, new Reward(-1, 0));
    }
}

Vue.component('task-component', {
    template: '<div class="paper" @dragstart="task.drag($event, task)" @dragend="task.dragStop" \
            :style="animation ? task.animation + (gameOver ? \' paused;\' : \'\') : \'\'" \
            @animationend="timeOut">{{ task.correctBin.id }}</div>',
    props: ['task', 'gameOver'],
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

class SortingTask extends Task {
    constructor(correctBin, taskCompleteCallback) {
        super(taskCompleteCallback);
        this.correctBin = correctBin;
        this.isValid = true;
    }

    run(target) {
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

class Game {
    constructor() {
        this.bins = [new Bin(1), new Bin(2), new Bin(3), new Bin(4), new Bin(5)];
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
