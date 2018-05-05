Vue.use(VueMaterial.default)

var deadline = Date.parse('26 April 2018');
var minimumPassingScore = 10;
var weekInMs = 6.048e+8;

String.prototype.visualLength = function(fontSize) {
    var ruler = document.getElementById("ruler");
    ruler.style.fontSize = fontSize;
    ruler.innerHTML = this;
    return ruler.offsetWidth;
}

var evaluateAutogrow = function(event) {
    var element = event.srcElement;
    element.style.height = 'auto';
    element.style.overflowY = 'hidden';
    var style = window.getComputedStyle(element);
    var lineHeight = style.lineHeight.replace('px', '');
    var text = element.value;
    var lines = text.split('\n');
    var linesCount = lines.length;
    for (line of lines) {
        if (line.visualLength(style.fontSize) > element.offsetWidth) {
            linesCount += 1
        }
    }
    var maxHeight = style.maxHeight.substring(0, style.maxHeight.length - 2);
    if (lineHeight * linesCount > maxHeight) {
        element.style.overflowY = 'scroll';
        return;
    }
    element.rows = linesCount;
}

var getTimeString = function(timeInMs, exclude) {
    var exclude = exclude || {};
    var seconds = timeInMs / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var weeks = days / 7;
    var timeString = '';
    if (weeks > 1 && !exclude['weeks']) {
        timeString += Math.floor(weeks) + (Math.floor(weeks) === 1 ? ' nädal ' : ' nädalat ');
    }
    if (days > 1 && !exclude['days']) {
        timeString += Math.floor(days % 7) + (Math.floor(days % 7) === 1 ? ' päev ' : ' päeva ');
    }
    if (hours > 0 && !exclude['hours']) {
        timeString += Math.floor(hours % 24) + (Math.floor(hours % 24) === 1 ? ' tund ' : ' tundi ');
    }
    if (minutes > 0 && !exclude['minutes']) {
        timeString += Math.floor(minutes % 60) + (Math.floor(minutes % 60) === 1 ? ' minut ' : ' minutit ');
    }
    if (seconds > 0 && !exclude['seconds']) {
        timeString += Math.floor(seconds % 60) + (Math.floor(seconds % 60) === 1 ? ' sekund' : ' sekundit');
    }
    return timeString;
}

function ScoreElement(shortName, description) {
    this.shortName = shortName;
    this.description = description;
    this.score = 0;
    this.reason = '';
    this.getScore = function() {
        return parseInt(this.score) || 0;
    }
}

function BonusScoreElement() {
    this.score = 0;
    this.reason = '';
    this.getScore = function() {
        return parseInt(this.score) || 0;
    }
    this.isScoreValid = true;
    this.scoreErrorMsg = '';
    this.reasonErrorMsg = '';
    this.isReasonValid = true;
    this.validateScore = function() {
        if (this.score < 0) {
            Vue.set(this, 'isScoreValid', false);
            Vue.set(this, 'scoreErrorMsg', 'Negatiivse skoori jaoks kasuta miinuspunkte');
        } else {
            Vue.set(this, 'isScoreValid', true);
            Vue.set(this, 'scoreErrorMsg', '');
        }
    }
    this.validateReason = function() {
        if (!this.reason) {
            Vue.set(this, 'isReasonValid', false);
            Vue.set(this, 'reasonErrorMsg', 'Boonuspunktid vajavad põhjendust');
        } else {
            Vue.set(this, 'isReasonValid', true);
            Vue.set(this, 'reasonErrorMsg', '');
        }
    }
    this.validate = function() {
        this.validateScore();
        this.validateReason();
    }
}

function NegativeScoreElement() {
    this.score = 0;
    this.reason = '';
    this.getScore = function() {
        return parseInt(this.score) || 0;
    }
    this.isScoreValid = true;
    this.scoreErrorMsg = '';
    this.reasonErrorMsg = '';
    this.isReasonValid = true;
    this.validateScore = function() {
        if (this.score < 0) {
            Vue.set(this, 'isScoreValid', false);
            Vue.set(this, 'scoreErrorMsg', 'Kaks korda miinuseid moodustab positiivse ja positiivse skoori jaoks kasuta boonuspunkte.');
        } else {
            Vue.set(this, 'isScoreValid', true);
            Vue.set(this, 'scoreErrorMsg', '');
        }
    }
    this.validateReason = function() {
        if (!this.reason) {
            Vue.set(this, 'isReasonValid', false);
            Vue.set(this, 'reasonErrorMsg', 'Miinuspunktid vajavad põhjendust');
        } else {
            Vue.set(this, 'isReasonValid', true);
            Vue.set(this, 'reasonErrorMsg', '');
        }
    }
    this.validate = function() {
        this.validateScore();
        this.validateReason();
    }
}

function BonusScore() {
    this.elements = [
    ];
    this.getScore = () => {
        return this.elements.reduce(function(accumulator, element) {
            return accumulator + element.getScore();
        }, 0);
    }
    this.addBonus = () => {
        this.elements.forEach(function(element) {
            element.validate();
        });
        this.elements.push(new BonusScoreElement());
    }
    this.removeBonus = (index) => {
        this.elements.splice(index, 1);
    }
}

function ExtraScore() {
    this.elements = [
        new ScoreElement('Ilus kujundus', ''),
        new ScoreElement('Kujundus toetab teemat', ''),
        new ScoreElement('Head ilmumised', ''),
        new ScoreElement('Hea sorteerimise tagasiside', ''),
        new ScoreElement('Hea lisaülesande \'episood\'', ''),
        new ScoreElement('Hea läbikukkumise tagasiside', ''),
        new ScoreElement('Heliline tagasiside', ''),
        new ScoreElement('Mängu õpitavus on hea', ''),
        new ScoreElement('Sorditavaid objekte saab lohistada', ''),
        new ScoreElement('Töötab ka mobiilil', '')
    ];
    this.maximumScore = 10;
    this.comment = '';
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
    this.score = 0;
    this.comment = '';
    this.getScore = function() {
        return Math.min(Math.max(this.score, 0), this.maximumScore);
    },
    this.errorMsg = '',
    this.isValid = true,
    this.validate = () => {
        if (this.score < 0) {
            this.isValid = false;
            this.errorMsg = 'Peab olema positiivne';
        } else if (this.score > 10) {
            this.isValid = false;
            this.errorMsg = 'Maksimum on 10';
        } else {
            this.isValid = true;
            this.errorMsg = '';
        }
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
        this.elements.forEach(function(element) {
            element.validate();
        });
        this.elements.push(new NegativeScoreElement());
    }
    this.removeNegative = function(index) {
        this.elements.splice(index, 1);
    }
}

function Plagiarism() {
    this.isPlagiarized = false;
    this.plagiarismModifierScore = 1;
    this.reason = '';
    this.togglePlagiarism = function() {
        Vue.set(this, 'isPlagiarized', !this.isPlagiarized);
        Vue.set(this, 'plagiarismModifierScore', this.isPlagiarized ? 0 : 1);
    }
    this.errorMsg = '';
    this.isValid = true;
    this.validate = function() {
        if (!this.reason) {
            this.isValid = false;
            this.errorMsg = 'Plagiaadina märkimisel on vaja põhjendust';
        } else {
            this.isValid = true;
            this.errorMsg = '';
        }
    }
}

function ProjectUrl() {
    this.url = '';
    this.dijkstraUrl = '';
    this.otherUrl = '';
    this.firstTouch = false;
    this.setDijkstraUrl = (username) => {
        this.firstTouch = true;
        if (!username) {
            if (this.url === this.dijkstraUrl) {
                this.toggleUrl();
            }
            return;
        }
        Vue.set(this, 'dijkstraUrl', 'http://dijkstra.cs.ttu.ee/~' + username + '/ui/t2');
        Vue.set(this, 'url', this.dijkstraUrl);
    }
    this.toggleUrl = () => {
        this.firstTouch = true;
        if (this.url === this.dijkstraUrl) {
            Vue.set(this, 'url', this.otherUrl);
        } else {
            Vue.set(this, 'url', this.dijkstraUrl);
        }
    }
    this.update = () => {
        this.firstTouch = true;
        if (this.url === this.dijkstraUrl) return;
        Vue.set(this, 'otherUrl', this.url);
    }
    this.open = () => {
        this.firstTouch = true;
        open(this.url);
    }
}

function Project() {
    this.url = new ProjectUrl();
    this.deadlineExtensionCount = 0;
    this.base = new BaseScore();
    this.extra = new ExtraScore();
    this.bonus = new BonusScore();
    this.negative = new NegativeScore();
    this.plagiarism = new Plagiarism();
    this.getScore = function() {
        return Math.max(this.plagiarism.plagiarismModifierScore * (Project.getDelayScore(-this.getTimeRemaining()) + 
                this.base.getScore() + this.extra.getScore() + this.bonus.getScore() - this.negative.getScore()), 0);
    }
    this.getTimeRemaining = function() {
        return this.getExtendedDeadline() - Date.now();
    }
    this.getExtendedDeadline = function() {
        return deadline + this.deadlineExtensionCount * weekInMs;
    }
    this.incrementDeadline = () => {
        Vue.set(this, 'deadlineExtensionCount', this.deadlineExtensionCount + 1);
    }
    this.decrementDeadline = () => {
        if (this.deadlineExtensionCount <= 0) return;
        Vue.set(this, 'deadlineExtensionCount', this.deadlineExtensionCount - 1);
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

function Student(username = 'test') {
    this.username = username;
}

function Group() {
    this.students = {};
    this.studentStrings = [];
    this.leader = null;
    this.project = new Project();
    this.addStudent = (username) => {
        Vue.set(this.students, username, new Student(username));
        this.validateStudents();
    }
    this.removeStudent = (username, index) => {
        Vue.set(this.students, username, null);
        this.setLeader(this.studentStrings[0], 0);
        this.validateStudents();
    }
    this.isStudentsValid = true;
    this.studentsErrorMsg = '';
    this.validateStudents = function() {
        if (this.studentStrings.length <= 0) {
            this.isStudentsValid = false;
            this.studentsErrorMsg = 'Registreeritud peab olema vähemalt üks tudeng';
        } else {
            this.isStudentsValid = true;
            this.studentsErrorMsg = '';
        }
    }
    this.setLeader = (username, index) => {
        Vue.set(this, 'leader', this.students[username] == this.leader ? null : this.students[username]);
        this.project.url.setDijkstraUrl(username);
    }
}

var vm = new Vue({
    el: '#app',
    data: {
        Project: Project,
        deadline: deadline,
        minimumPassingScore: minimumPassingScore,
        group: new Group(),
        showMenu: false,
        isSmallScreen: window.innerWidth < 600,
        isProjectSelected: true,
        isBaseScoreOther: false,
        baseScoreValues: [0, 5, 10]
    },
    methods: {
        getTimeString: getTimeString,
        evaluateAutogrow: evaluateAutogrow,
        setIsBaseScoreOtherFalseAndUpdate: function(idx) {
            Vue.set(this, 'isBaseScoreOther', false);
            Vue.set(this, 'baseScoreValues', [0, 5, 10]);
            Vue.set(this.group.project.base, 'score', this.baseScoreValues[idx]);
            this.group.project.base.validate();
        },
        setIsBaseScoreOtherTrueAndUpdate: function(event) {
            Vue.set(this, 'isBaseScoreOther', true);
            Vue.set(this, 'baseScoreValues', [null, null, null]);
            event && event.srcElement.select();
            this.group.project.base.validate();
        }
    },
    computed: {
    },
    mounted() {
        this.$nextTick(() => window.addEventListener('resize', (e) => {
            this.isSmallScreen = window.innerWidth < 600;
        }))
    }
});
