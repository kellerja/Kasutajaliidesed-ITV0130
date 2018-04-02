const TaskState = {
    NOT_STARTED: 0,
    RUNNING: 100,
    COMPLETED: 200,
    FAILED: 400
}

const trashCan = "<svg viewBox=\"0 0 512 512\"> \
<g class=\"lid\"> \
<path d=\"M432.232,94.608c-9.876-36.826-43.402-62.546-81.529-62.546H300.29c5.793-2.649,9.826-8.481,9.826-15.267 \
   C310.116,7.52,302.597,0,293.321,0h-74.643c-9.275,0-16.795,7.52-16.795,16.795c0,6.786,4.033,12.618,9.826,15.267h-50.413 \
   c-38.127,0-71.654,25.72-81.529,62.547c-2.857,10.66,5.188,21.145,16.224,21.145h320.02 \
   C427.048,115.753,435.091,105.266,432.232,94.608z\" fill=\"#707070\"/> \
</g> \
<g class=\"bin\"> \
<path d=\"M416.011,149.343H95.991c-9.83,0-17.567,8.419-16.734,18.218l27.991,329.068c0.739,8.693,8.01,15.372,16.734,15.372 \
   H388.02c8.724,0,15.995-6.679,16.734-15.372l27.991-329.068C433.578,157.766,425.845,149.343,416.011,149.343z M176.914,457.118 \
   c-9.173,0.85-17.405-5.908-18.254-15.196l-20.154-220.57c-0.843-9.237,5.96-17.409,15.197-18.254 \
   c9.234-0.843,17.409,5.959,18.254,15.196l20.154,220.57C192.954,448.102,186.151,456.274,176.914,457.118z M272.795,440.393 \
   c0,9.275-7.52,16.795-16.795,16.795s-16.795-7.52-16.795-16.795v-220.57c0-9.275,7.52-16.795,16.795-16.795 \
   s16.795,7.52,16.795,16.795V440.393z M373.494,221.352l-20.154,220.57c-0.849,9.287-9.079,16.046-18.254,15.196 \
   c-9.237-0.844-16.041-9.016-15.197-18.254l20.154-220.57c0.844-9.237,9.023-16.051,18.254-15.196 \
   C367.534,203.942,374.337,212.114,373.494,221.352z\" fill=\"#707070\"/> \
</g> \
</svg>";

const moneyBag = "<svg viewBox=\"0 0 512 512\"> \
<g class=\"bag\"> \
    <g class=\"top\"> \
        <path d=\"M166.734,95.797H345.25c0,0,70.75-61.719,38.75-88.719s-103,30-128,28 \
            c-25,2-96-55-128-28S166.734,95.797,166.734,95.797z\"/> \
    </g> \
    <g class=\"knot\"> \
        <path d=\"M336,111.797c8.844,0,16,7.156,16,16s-7.156,16-16,16H176c-8.844,0-16-7.156-16-16s7.156-16,16-16H336z\"/> \
    </g> \
    <g class=\"bottom\"> \
        <path d=\"M345.25,159.797H166.734C87.469,217.609,32,340.141,32,417.953c0,104.656,100.281,93.5,224,93.5s224,11.156,224-93.5 \
            C480,340.141,424.531,217.609,345.25,159.797z\"/> \
    </g> \
</g> \
</svg>";

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

Vue.component('bin', {
    template: '<div :class="[\'basket\', {\'open\' : isOpen}, {\'failed\': isFailed}, {\'correct\': isCorrect}]" \
        @drop="handleDrop($event)" @contextmenu.prevent="" @dragover.prevent="" \
        @dragenter="handleDragEnter()" @dragleave="handleDragLeave()" v-html="bin.imageUrl"></div>',
    props: ['bin'],
    data: function() {
        return {
            isOpen: false,
            isFailed: false,
            isCorrect: false
        }
    },
    methods: {
        handleDrop: function(event) {
            this.isOpen = false;
            this.bin.drop(event, this.bin);
            if (!tempDragObject) return;
            switch (tempDragObject.state) {
                case TaskState.FAILED:
                    this.isFailed = true;
                    setTimeout(() => {
                        this.isFailed = false;
                    }, 200)
                    break;
                case TaskState.COMPLETED:
                    this.isCorrect = true;
                    setTimeout(() => {
                        this.isCorrect = false;
                    }, 200)
                    break;
            }
        },
        handleDragEnter: function() {
            this.isOpen = true;
        },
        handleDragLeave: function() {
            this.isOpen = false;
        }
    }
})

class Reward {
    constructor(deltaLives, deltaScore) {
        this.deltaLives = deltaLives;
        this.deltaScore = deltaScore;
    }
}

class Task {
    constructor(taskCompleteCallback) {
        this.state = TaskState.NOT_STARTED;
        this.score = 0;
        this.id = Math.random();
        this.taskCompleteEvent = taskCompleteCallback;
        this.animation = '500s linear 0s 1 timer';
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
                @animationend="timeOut" @contextmenu.prevent=""> \
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
                @dragend="task.dragStop" @contextmenu.prevent="" \
                :style="{animation:  (animation ? (task.animation + (gameOver ? \' paused\' : \'\')) : \'\'), \
                    cursor: (gameOver ? \'default\' : \'move\')}" \
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
        const selectedContent = correctBin.contentUrls[Math.floor(Math.random() * correctBin.contentUrls.length)];
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
        const playerGuess = Number.parseFloat(target);
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
    ['/assets/wrench.svg', 0],
    ['/assets/Mail-mark-junk-2.svg', 0],
    ['/assets/food.svg', 0],
    ['/assets/fries.svg', 0],
    ['/assets/burger.svg', 0],
    ['/assets/Cinder_Block_clip_art.svg', 0],
    ['/assets/Red_apple_with_leaf.svg', 0]
];

let bioTrashAssets = [
    ['/assets/Tux_Paint_banana.svg', 0]
];

class Game {
    constructor() {
        this.bins = [new Bin(2, trashCan, trashAssets.concat(bioTrashAssets)), 
                     new Bin(3, moneyBag, valuableAssets)];
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
        const taskIndex = this.tasks.indexOf(task);
        this.tasks[taskIndex].isValid = false;
        this.tasks.splice(taskIndex, 1, this.generateNewSortingTask());
    }

    extraTaskCompleteCallback(task, reward) {
        this.player.applyReward(reward);
        Vue.set(this, 'extraTask', null);
    }

    generateNewSortingTask() {
        return new SortingTask(this.bins[Math.floor(Math.random() * this.bins.length)],
                                (res, reward) => this.taskCompleteCallback(res, reward));
    }

    generateCalculationTask() {
        let formula = [];
        const ops = ['+', '-', '/', '*'];
        formula.push(+Math.floor(Math.random() * 10).toFixed(3));
        formula.push(ops[Math.floor(Math.random() * ops.length)]);
        formula.push(+Math.floor(Math.random() * 10).toFixed(3));
        if (formula[1] === '/' && formula[2] === 0) formula[2] = 1;
        const result = +eval(formula.join('')).toFixed(3);
        formula.push('=');
        formula.push(result);
        let xPos;
        if ((formula[0] === 0 || formula[2] == 0) && formula[1] === '*') {
            xPos = 4;
        } else if (formula[1] === '/' && formula[0] === 0) {
            xPos = [0, 4][Math.floor(Math.random() * 3)];
        } else {
            xPos = [0, 2, 4][Math.floor(Math.random() * 3)];
        }
        return new CalculationTask(formula, xPos, (res, reward) => this.extraTaskCompleteCallback(res, reward));
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
