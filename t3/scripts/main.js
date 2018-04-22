var deadline = Date.parse('26 April 2018');
var minimumPassingScore = 10;
var weekInMs = 6.048e+8;

function ScoreElement(shortName, description) {
    this.shortName = shortName;
    this.description = description;
    this.score = 0;
    this.reason = '';
    this.getScore = function() {
        return parseInt(this.score);
    }
}

function BonusScore() {
    this.elements = [
    ];
    this.getScore = function() {
        return this.elements.reduce(function(accumulator, element) {
            return accumulator + element.getScore();
        }, 0);
    }
    this.addBonus = function() {
        this.elements.push(new ScoreElement('', ''));
    }
    this.removeBonus = function(index) {
        this.elements.splice(index, 1);
    }
}

function ExtraScore() {
    this.elements = [
        new ScoreElement('Ilus kujundus', ''),
        new ScoreElement('Kujundus toetab teemat', ''),
        new ScoreElement('Head ilmumised', ''),
        new ScoreElement('Hea sorteerimise tagasiside', ''),
        new ScoreElement('Hea liasülesande \'episood\'', ''),
        new ScoreElement('Hea läbikukkumise tagasiside', ''),
        new ScoreElement('Heliline tagasiside', ''),
        new ScoreElement('Mängu õpitavus on hea', ''),
        new ScoreElement('Sorditavaid objekte saab lohistada', ''),
        new ScoreElement('Töötab ka mobiilil', '')
    ];
    this.maximumScore = 10;
    this.getScore = function() {
        return this.elements.reduce(function(accumulator, element) {
            return accumulator + element.getScore();
        }, 0);
    }
}

function BaseScore() {
    this.elements = [
        new ScoreElement('Ootejärjekord', ''),
        new ScoreElement('Sorteerimine', ''),
        new ScoreElement('Perioodiline lisaülesanne', ''),
        new ScoreElement('Elude kaotamine', ''),
        new ScoreElement('Mängu läbikukkumine ja kordamine', ''),
        new ScoreElement('Tähelepanu juhtimine animatsioonidega', ''),
    ];
    this.maximumScore = 10;
    this.getScore = function() {
        return this.elements.reduce(function(accumulator, element) {
            return accumulator + element.getScore();
        }, 0);
    }
}

function NegativeScore() {
    this.elements = [
    ];
    this.getScore = function() {
        return this.elements.reduce(function(accumulator, element) {
            return accumulator + element.getScore();
        }, 0);
    }
    this.addNegative = function() {
        this.elements.push(new ScoreElement('', ''));
    }
    this.removeNegative = function(index) {
        this.elements.splice(index, 1);
    }
}

function Plagiarism() {
    this.isPlagiarized = false;
    this.plagiarismModifierScore = 1;
    this.togglePlagiarism = function() {
        Vue.set(this, 'isPlagiarized', !this.isPlagiarized);
        Vue.set(this, 'plagiarismModifierScore', this.isPlagiarized ? 0 : 1);
    }
}

function Project() {
    this.url = '';
    this.deadlineExtensionCount = 0;
    this.base = new BaseScore();
    this.extra = new ExtraScore();
    this.bonus = new BonusScore();
    this.negative = new NegativeScore();
    this.plagiarism = new Plagiarism();
    this.getScore = function() {
        return this.plagiarism.plagiarismModifierScore * (Project.getDelayScore(-this.getTimeRemaining()) + 
                this.base.getScore() + this.extra.getScore() + this.bonus.getScore() + this.negative.getScore());
    }
    this.getTimeRemaining = function() {
        return this.getExtendedDeadline() - Date.now();
    }
    this.getExtendedDeadline = function() {
        return deadline + this.deadlineExtensionCount * weekInMs;
    }
}

Project.getDelayScore = function(delayInMs) {
    if (delayInMs <= 0) {
        return 0;
    }
    var score = -5;
    if (delayInMs <= weekInMs) {
        score = -2;
    }
    return score;
}

function Student() {
    this.username = ''
}

function Group() {
    this.students = [new Student()];
    this.project = new Project();
    this.addStudent = function() {
        this.students.push(new Student());
    }
    this.removeStudent = function(index) {
        this.students.splice(index, 1);
    }
}

var vm = new Vue({
    el: '#app',
    data: {
        Project: Project,
        deadline: deadline,
        minimumPassingScore: minimumPassingScore,
        groups: [new Group()]
    },
    methods: {
        getTimeString: function(timeInMs) {
            var seconds = timeInMs / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;
            var weeks = days / 7;
            var timeString = '';
            if (weeks > 1) {
                timeString += Math.floor(weeks) + ' weeks ';
            }
            if (days > 1) {
                timeString += Math.floor(days % 7) + ' days ';
            }
            if (hours > 0) {
                timeString += Math.floor(hours % 24) + ' hours ';
            }
            if (minutes > 0) {
                timeString += Math.floor(minutes % 60) + ' minutes ';
            }
            if (seconds > 0) {
                timeString += Math.floor(seconds % 60) + ' seconds';
            }
            return timeString;
        }
    },
    computed: {
    }
});
