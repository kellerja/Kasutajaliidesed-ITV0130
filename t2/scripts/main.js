let TaskState = {
    NOT_STARTED: 0,
    RUNNING: 100,
    COMPLETED: 200,
    FAILED: 400
}

var tempDragObject = null;

class Player {
    constructor(gameOverCallback) {
        this.maxLives = 3;
        this.lives = this.maxLives;
        this.score = 0;
        this.gameOverEvent = gameOverCallback;
    }

    deltaLives(delta) {
        this.lives += delta;
        if (this.isDead()) {
            this.gameOverEvent && this.gameOverEvent(this.score);
        }
    }

    deltaScore(delta) {
        this.score += delta;
    }

    applyReward(reward) {
        if (this.isDead()) return;
        this.deltaScore(reward.deltaScore);
        this.deltaLives(reward.deltaLives);
    }

    isDead() {
        return this.lives <= 0;
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
        this.animation = '50s linear 0s 1 timer';
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
    template: '<div class="extra-task-calc" \
                :style="{animation: (animation ? task.animation + (gameOver ? \' paused;\' : \'\') : \'\')}" \
                @animationend="timeOut"> \
                    <p style="margin: 0; padding: 0; margin-bottom: 0.3rem;">Find x:<br> {{task.challenge.formula}}</p> \
                    <input type="number" class="w-100" v-model="guess"> \
                    <button @click="task.run(guess)" class="btn w-100">Hack</button> \
                </div>',
    props: ['task', 'gameOver'],
    data: function() {
        return {
            guess: '',
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

Vue.component('draggable-task-component', {
    template: '<img class="task" :src="task.imageUrl" :draggable="!gameOver" @dragstart="task.drag($event, task)" \
                @dragend="task.dragStop" \
                :style="{animation:  (animation ? task.animation + (gameOver ? \' paused\' : \'\') : \'\'), \
                    cursor: + (gameOver ? \'default\' : \'move\')}" \
                @animationend="timeOut">',
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
})

class SortingTask extends DraggableTask {
    constructor(correctBin, taskCompleteCallback) {
        super(taskCompleteCallback);
        this.correctBin = correctBin;
        let selectedContent = correctBin.contentUrls[Math.floor(Math.random() * correctBin.contentUrls.length)];
        this.imageUrl = selectedContent[0];
        this.score = selectedContent[1];
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
    constructor(formula, xPos, taskCompleteCallback) {
        super(taskCompleteCallback);
        let hiddenFormula = Object.assign([], formula);
        hiddenFormula.splice(xPos, 1, 'x');
        this.challenge = {
            formula: hiddenFormula.join(' '),
            correct: formula[xPos]
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
    ['/assets/diamond.svg', 100],
    ['/assets/engagement-ring.svg', 50],
    ['/assets/Gold_Block_clip_art.svg', 70],
    ['/assets/gold.svg', 66],
    ['/assets/jewel.svg', 65],
    ['/assets/coin-stack.svg', 88],
    ['/assets/money-bag.svg', 87],
    ['/assets/money-svgrepo-com.svg', 63],
];

let trashAssets = [
    ['/assets/wrench.svg', 1]
];

let bioTrashAssets = [
    ['/assets/Tux_Paint_banana.svg', 1]
];

class Game {
    constructor() {
        this.bins = [/*new Bin(1, '/assets/recycle-bin-interface-symbol.svg', bioTrashAssets), */
                     new Bin(2, '/assets/delete.svg', trashAssets), 
                     new Bin(3, '/assets/money-bag-2.svg', valuableAssets)];
        this.numOfSortingTasks = 2;
        this.restart();
        this.extraTask = null;
        this.extraTaskIntervalFunction = () => {
            if (this.extraTask || Math.random() < 0.5) return;
            Vue.set(this, 'extraTask', this.generateCalculationTask());
        };
        this.extraTaskIntervalRepeatTimeInMillis = 10000;
        this.extraTaskInterval = setInterval(this.extraTaskIntervalFunction, this.extraTaskIntervalRepeatTimeInMillis);
    }

    gameOverCallback(score) {
        this.isGameOver = true;
        document.body.style.backgroundImage = 'url("/background/background_arrested.png")';
        clearInterval(this.extraTaskInterval);
        Vue.set(this, 'extraTask', null);
    }

    taskCompleteCallback(task, reward) {
        this.player.applyReward(reward);
        let taskIndex = this.tasks.indexOf(task);
        this.tasks[taskIndex].isValid = false;
        this.tasks.splice(taskIndex, 1);
        this.tasks.push(this.generateNewSortingTask());
    }

    extraTaskCopleteCallback(task, reward) {
        this.player.applyReward(reward);
        Vue.set(this, 'extraTask', null);
    }

    generateNewSortingTask() {
        return new SortingTask(this.bins[Math.floor(Math.random() * this.bins.length)],
                                (res, reward) => this.taskCompleteCallback(res, reward));
    }

    generateCalculationTask() {
        let formula = [];
        let ops = ['+', '-', '/', '*'];
        formula.push(+Math.floor(Math.random() * 10).toFixed(3));
        formula.push(ops[Math.floor(Math.random() * ops.length)]);
        formula.push(+Math.floor(Math.random() * 10).toFixed(3));
        if (formula[1] === '/' && formula[2] === 0) formula[2] = 1;
        let result = +eval(formula.join('')).toFixed(3);
        formula.push('=');
        formula.push(result);
        var xPos = [0, 2, 4][Math.floor(Math.random() * 3)];
        if ((formula[0] === 0 || formula[2] == 0) && formula[1] === '*') xPos = 4;
        return new CalculationTask(formula, xPos, (res, reward) => this.extraTaskCopleteCallback(res, reward));
    }

    restart() {
        this.isGameOver = false;
        this.player = new Player((score) => this.gameOverCallback(score));
        this.tasks = Array.from({length: this.numOfSortingTasks}, () => this.generateNewSortingTask());
        document.body.style.backgroundImage = 'url("/background/background.png")';
        this.extraTaskInterval = setInterval(this.extraTaskIntervalFunction, this.extraTaskIntervalRepeatTimeInMillis);
    }
}

let vm = new Vue({
    el: '#game',
    data: {
        game: new Game()
    }
});
