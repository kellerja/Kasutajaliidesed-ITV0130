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

function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function css_time_to_milliseconds(time_string) {
    var num = parseFloat(time_string, 10),
    unit = time_string.match(/m?s/),
    milliseconds;

    if (unit) {
        unit = unit[0];
    }

    switch (unit) {
        case "s": // seconds
            milliseconds = num * 1000;
            break;
        case "ms": // milliseconds
            milliseconds = num;
            break;
        default:
            milliseconds = 0;
            break;
    }

    return milliseconds;
}

var tempDragObject = null;

class SoundManager {

    constructor() {
        this.currentlyPlaying = null;
        this.currentlyPlayingPromise = null;
        this.playUntiltimeoutContainer = {};
    }

    stop(callback) {
        if (!this.currentlyPlaying) {
            callback && callback();
            return;
        };
        this.currentlyPlayingPromise.then(() => {
            this.currentlyPlaying.pause();
            this.currentlyPlaying = null;
            callback && callback();
        }).catch(e => {
            this.currentlyPlaying = null;
            callback && callback();
        });
    }

    play(sound) {
        if (this.currentlyPlaying || !sound) {
            return;
        }
        this.currentlyPlaying = new Audio(sound);
        this.currentlyPlayingPromise = this.currentlyPlaying.play();
        this.currentlyPlaying.addEventListener("ended", () => {
            this.currentlyPlaying = null;
        });
    }

    forcePlay(sound) {
        if (!sound) return;
        this.stop(() => {
            this.play(sound);
        });
    }

    stopUntilTimeout(sound) {
        if (!this.playUntiltimeoutContainer[sound]) return;
        this.playUntiltimeoutContainer[sound].audio.pause();
        clearTimeout(this.playUntiltimeoutContainer[sound].timeout);
        this.playUntiltimeoutContainer[sound] = null;
    }

    playUntilTimeout(sound, timeout) {
        this.playUntiltimeoutContainer[sound] = {audio: new Audio(sound)};
        this.playUntiltimeoutContainer[sound].audio.loop = true;
        this.playUntiltimeoutContainer[sound].audio.play().then(
            this.playUntiltimeoutContainer[sound].timeout = setTimeout(() => {
                this.playUntiltimeoutContainer[sound].audio.pause();
            }, timeout)
        );
    }

    stopAllSounds() {
        this.stop();
        for (const sound of Object.keys(this.playUntiltimeoutContainer)) {
            this.stopUntilTimeout(sound);
        }
    }
}

const soundManager = new SoundManager();

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
    constructor(identifier, imageUrl, contentUrls, dropCorrectSound, dropIncorrectSound)  {
        this.id = identifier;
        this.imageUrl = imageUrl;
        this.contentUrls = contentUrls;
        this.dropCorrectSound = dropCorrectSound;
        this.dropIncorrectSound = dropIncorrectSound;
    }

    drop(event, bin, player) {
        if (!(tempDragObject instanceof DraggableTask)) {
            return;
        }
        tempDragObject.run(bin, player);
        if (!vm.game.isGameOver) soundManager.forcePlay(tempDragObject.state == TaskState.COMPLETED ? this.dropCorrectSound : this.dropIncorrectSound);
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
        this.animationDuration = '10s';
        this.isValid = true;
    }

    start() {
        this.state = TaskState.RUNNING;
    }

    run(target, player) {
    }

    finish() {}

    timeout(timeOut) {
        this.state = TaskState.FAILED;
        if (timeOut) {
            setTimeout(() => this.taskCompleteEvent(this, new Reward(-1, 0)), timeOut);
        } else {
            this.taskCompleteEvent(this, new Reward(-1, 0));
        }
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
                :style="{ animation: animation ? ( \
                    ( \
                        endAnimation ? \
                            ((success ? \'calc-task-success \' : \'calc-task-fail \') + endAnimationTimeInMs + \'ms ease-out 0s 1 forwards\') : \
                            (\'calc-task \' + task.animationDuration + \' linear 0s 1 forwards\') \
                    ) + \
                    (gameOver ? \' paused;\' : \'\') \
                ) : \'\' }"> \
                    <img class="extra-task-calc-fuse" \
                        :style="{ animation: animation ? ( \
                            (\'calc-task-fuse \' + task.animationDuration + \' linear 0s 1 forwards\') + \
                            (gameOver ? \' paused;\' : \'\') \
                        ) : \'\' }" \
                        @animationend="timeOut" @contextmenu.prevent="" src="assets/electricity.svg"> \
                    <p style="margin: 0; padding: 0; margin-bottom: 0.3rem; background-color: white;">Find x:<br> {{task.challenge.formula}}</p> \
                    <input style="background-color: white;" type="text" class="w-100" v-model="guess"> \
                    <button @click="handleSubmit()" class="btn w-100">Hack</button> \
                </div>',
    props: ['task', 'gameOver'],
    data: function() {
        return {
            guess: '',
            animation: false,
            endAnimation: false,
            endAnimationTimeInMs: 200,
            success: false
        };
    },
    methods: {
        timeOut: function(event) {
            soundManager.forcePlay('sounds/alarm_short.mp3');            
            this.task.timeout(this.endAnimationTimeInMs);
            this.success = false;
            this.endAnimation = true;
        },
        handleSubmit() {
            this.task.run(this.guess, this.endAnimationTimeInMs);
            this.success = this.task.state == TaskState.COMPLETED;
            soundManager.stopUntilTimeout('sounds/fuse.mp3');
            if (!this.success) {
                soundManager.forcePlay('sounds/alarm_short.mp3');
            } else {
                soundManager.forcePlay('sounds/262858__jamesabdulrahman__blip-1.flac');
            }
            this.endAnimation = true;
        }
    },
    mounted: function() {
        this.animation = true;
        soundManager.playUntilTimeout('sounds/fuse.mp3', css_time_to_milliseconds(this.task.animationDuration));
        this.task.start();
    },
    beforeDestroy: function() {
        this.animation = false;
    }
});

Vue.component('draggable-task-component', {
    template: '<img class="task" :src="task.imageUrl" :draggable="!gameOver && !disabled" @dragstart="task.drag($event, task)" \
                @dragend="task.dragStop" @contextmenu.prevent="" \
                :style="{animation:  (animation ? ( \
                        (timeOutAnimation ? (\'timeout \' + timeOutAnimationTimeInMs + \'ms ease-in 0s 1 forwards\') : \
                        ( \
                            welcomeAnimation ? (\'taskEntrance \' + welcomeAnimationTimeInMs + \'ms ease-out 0s 1 forwards\') : \
                            (\'timer \' + task.animationDuration + \' linear 0s 1\') + (gameOver || disabled ? \' paused\' : \'\'))) \
                        ) : \'\'), \
                    cursor: (gameOver || disabled ? \'default\' : \'move\')}" \
                @animationend="timeOut" @touchstart.prevent="touchStartHandler" @touchmove="touchMoveHandler" @touchend="touchEndHandler">',
    props: ['task', 'gameOver', 'disabled'],
    data: function() {
        return {
            animation: false,
            welcomeAnimation: false,
            welcomeAnimationTimeInMs: 200,
            timeOutAnimation: false,
            timeOutAnimationTimeInMs: 200,
            cloneElement: null,
            cloneElementOffset: {
                x: 0,
                y: 0
            },
            lastTarget: null
        };
    },
    methods: {
        timeOut: function(event) {
            if (this.timeOutAnimation) return;
            if (this.welcomeAnimation) {
                this.welcomeAnimation = false;
                this.task.start();
                return;
            }
            this.timeOutAnimation = true;
            this.task.timeout(this.timeOutAnimationTimeInMs);
        },
        touchStartHandler: function(event) {
            this.task.drag(event, this.task);

            if (this.cloneElement) {
                this.destroyImgClone();
            }
            this.createImgClone(event.srcElement);
            this.cloneElementOffset.x = event.touches[0].clientX - event.srcElement.getBoundingClientRect().left + convertRemToPixels(2);
            this.cloneElementOffset.y = event.touches[0].clientY - event.srcElement.getBoundingClientRect().top;
            document.body.appendChild(this.cloneElement);
            requestAnimationFrame(() => {
                if (!this.cloneElement) return;
                let cloneStyle = this.cloneElement.style;
                cloneStyle.position = 'absolute';
                cloneStyle.pointerEvents = 'none';
                cloneStyle.zIndex = '999999';
                cloneStyle.left = Math.round(event.touches[0].pageX - this.cloneElementOffset.x) + 'px';
                cloneStyle.top = Math.round(event.touches[0].pageY - this.cloneElementOffset.y) + 'px';
            });
        },
        touchMoveHandler: function(event) {
            let element = event.srcElement;
            let target = this.getTarget(event);
            if (target && target != this.lastTarget) {
                this.emitDefaultEvent(event, 'dragleave', this.lastTarget);
                this.emitDefaultEvent(event, 'dragenter', target);
            }
            this.lastTarget = target;
            requestAnimationFrame(() => {
                if (!this.cloneElement) return;
                let cloneStyle = this.cloneElement.style;
                cloneStyle.position = 'absolute';
                cloneStyle.pointerEvents = 'none';
                cloneStyle.zIndex = '999999';
                cloneStyle.left = Math.round(event.touches[0].pageX - this.cloneElementOffset.x) + 'px';
                cloneStyle.top = Math.round(event.touches[0].pageY - this.cloneElementOffset.y) + 'px';
            });
        },
        touchEndHandler: function(event) {
            if (this.lastTarget) {
                this.emitDefaultEvent(event, 'drop', this.lastTarget);
                this.emitDefaultEvent(event, 'dragleave', this.lastTarget);
            }

            this.task.dragStop(event);
            this.destroyImgClone();
            
        },
        destroyImgClone() {
            if (!!this.cloneElement && !!this.cloneElement.parentElement) {
                this.cloneElement.parentElement.removeChild(this.cloneElement);
            }
            this.cloneElement = null;
        },
        createImgClone(imgElement) {
            this.cloneElement = imgElement.cloneNode(true);
            this.cloneElement.style.animation = 'none';
            this.cloneElement.style.opacity = '0.5';
        },
        getTarget(event) {
            el = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY)
            while (el && getComputedStyle(el).pointerEvents == 'none') {
                el = el.parentElement;
            }
            return el;
        },
        emitDefaultEvent(e, type, target) {
            if (e && target) {
                var evt = document.createEvent('Event'), t = e.touches ? e.touches[0] : e;
                evt.initEvent(type, true, true);
                evt.button = 0;
                evt.which = evt.buttons = 1;
                evt.dataTransfer = {};
                target.dispatchEvent(evt);
                return evt.defaultPrevented;
            }
            return false;
        }
    },
    mounted: function() {
        this.animation = true;
        this.welcomeAnimation = true;
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

    run(target, _) {
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
        this.animationDuration = '10s';
    }

    run(target, timeout) {
        if (this.state != TaskState.RUNNING) return;
        const playerGuess = Number.parseFloat(target);
        if (isNaN(playerGuess)) return;
        let reward;
        if (Math.abs(playerGuess - this.challenge.correct) < 10e-3) {
            this.state = TaskState.COMPLETED;
            reward = new Reward(0, this.score);
        } else {
            this.state = TaskState.FAILED;
            reward = new Reward(-1, 0);
        }
        setTimeout(() => {
            this.taskCompleteEvent(this, reward);
        }, timeout || 0);
    }
}

const assetBase = 'assets/';

let valuableAssets = [
    [assetBase + 'diamond.svg', 100],
    [assetBase + 'engagement-ring.svg', 50],
    [assetBase + 'Gold_Block_clip_art.svg', 70],
    [assetBase + 'gold.svg', 66],
    [assetBase + 'jewel.svg', 65],
    [assetBase + 'coin-stack.svg', 88],
    [assetBase + 'money-bag.svg', 87],
    [assetBase + 'money-svgrepo-com.svg', 63],
];

let trashAssets = [
    [assetBase + 'wrench.svg', 0],
    [assetBase + 'Mail-mark-junk-2.svg', 0],
    [assetBase + 'food.svg', 0],
    [assetBase + 'fries.svg', 0],
    [assetBase + 'burger.svg', 0],
    [assetBase + 'Cinder_Block_clip_art.svg', 0],
    [assetBase + 'Red_apple_with_leaf.svg', 0]
];

let bioTrashAssets = [
    [assetBase + 'Tux_Paint_banana.svg', 0]
];

const backgroundBase = 'background/';

class Game {
    constructor() {
        this.bins = [new Bin(2, trashCan, trashAssets.concat(bioTrashAssets), 'sounds/thump.mp3', 'sounds/wrong.mp3'), 
                     new Bin(3, moneyBag, valuableAssets, 'sounds/350870__cabled-mess__coin-c-03.wav', 'sounds/wrong.mp3')];
        this.numOfSortingTasks = 2;
        this.restart();
        this.extraTask = null;
        this.extraTaskGracePeriod = false;
        this.extraTaskGracePeriodTimeout = 5000;
        this.extraTaskChance = 0.5;
        this.extraTaskIntervalFunction = () => {
            if (this.extraTask) return;
            if (Math.random() < this.extraTaskChance) {
                this.extraTaskChance = this.extraTaskChance - 0.2;
                return;
            }
            if (this.extraTaskGracePeriod) {
                setTimeout(() => {
                    if (!this.extraTask) {
                        Vue.set(this, 'extraTask', this.generateCalculationTask());
                    }
                }, this.extraTaskGracePeriodTimeout);
            } else {
                Vue.set(this, 'extraTask', this.generateCalculationTask());
            }
        };
        this.extraTaskIntervalRepeatTimeInMillis = 2000;
        this.extraTaskInterval = setInterval(this.extraTaskIntervalFunction, this.extraTaskIntervalRepeatTimeInMillis);
    }

    gameOverCallback(score) {
        this.isGameOver = true;
        this.setArrestedBackground();
        clearInterval(this.extraTaskInterval);
        Vue.set(this, 'extraTask', null);
        soundManager.stopAllSounds();
        soundManager.forcePlay('sounds/police_siren.mp3');
    }

    taskCompleteCallback(task, reward) {
        this.player.applyReward(reward);
        const taskIndex = this.tasks.indexOf(task);
        this.tasks[taskIndex].isValid = false;
        this.tasks.splice(taskIndex, 1, this.generateNewSortingTask());
        setTimeout(() => this.extraTaskGracePeriod = false, this.extraTaskGracePeriodTimeout);
    }

    extraTaskCompleteCallback(task, reward) {
        this.player.applyReward(reward);
        this.extraTaskGracePeriod = true;
        this.extraTaskChance = 0.5;
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
        this.extraTaskGracePeriod = false;
        soundManager.stop();
        this.player = new Player((score) => this.gameOverCallback(score));
        this.tasks = Array.from({length: this.numOfSortingTasks}, () => this.generateNewSortingTask());
        this.setBackground();
        this.extraTaskInterval = setInterval(this.extraTaskIntervalFunction, this.extraTaskIntervalRepeatTimeInMillis);
    }

    setBackground() {
        document.body.style.backgroundImage = 'url("' + backgroundBase + 'background' + 
                        (window.innerWidth <= 767 ? '_small' : '') + '.png")';
    }

    setArrestedBackground() {
        document.body.style.backgroundImage = 'url("' + backgroundBase + 'background_arrested' + 
                        (window.innerWidth <= 767 ? '_small' : '') + '.png")';
    }
}

let vm = new Vue({
    el: '#game',
    data: {
        game: new Game(),
        isSmallDevice: window.innerWidth <= 991
    },
    mounted() {
        this.$nextTick(() => window.addEventListener('resize', (e) => {
            this.isSmallDevice = window.innerWidth <= 991;
            if (!this.game.isGameOver) {
                this.game.setBackground();
            } else {
                this.game.setArrestedBackground();
            }
        }))
    },
});
