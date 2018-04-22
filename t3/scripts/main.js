var deadline = Date.parse('23 April 2018');
var minimumPassingScore = 10;
var weekInMs = 6.048e+8;

function ScoreElement(shortName, description) {
    this.shortName = shortName;
    this.description = description;
    this.score = 0;
    this.reason = '';
    this.getScore = function() {
        return this.score;
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
    this.getScore = function() {
        return this.elements.reduce(function(accumulator, element) {
            return accumulator + element.getScore();
        }, 0);
    }
}

function NegativeScore() {
    this.getScore = function() {
        return this.elements.reduce(function(accumulator, element) {
            return accumulator + element.getScore();
        }, 0);
    }
}

function Plagiarism() {
    this.isPlagiarized = false;
    this.plagiarismModifierScore = 1;
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
        return plagiarismModifierScore * (Project.getDelayScore(Date.now() - (this.deadlineExtensionCount * weekInMs) - deadline) + 
                this.base.getScore() + this.extra.getScore() + this.bonus.getScore() + this.negative.getScore());
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
}

function Group() {
    this.students = [new Student()];
    this.project = new Project();
}

var vm = new Vue({
    el: '#app',
    data: {
        groups: [new Group()]
    },
    methods: {
    },
    computed: {
    }
});
