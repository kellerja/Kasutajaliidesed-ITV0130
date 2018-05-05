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
        new ScoreElement('Ilus kujundus', 'Visuaalselt näeb kaunis välja'),
        new ScoreElement('Kujundus toetab teemat', 'Mängus on läbiv teema'),
        new ScoreElement('Head ilmumised', 'Sorteeritavad objektid ja lisaülesanded ilmuvad hästi (head animatsioonid)'),
        new ScoreElement('Hea sorteerimise tagasiside', 'Peale sorteerimist saab vaevata aru kas valik oli õige või vale'),
        new ScoreElement('Hea lisaülesande \'episood\'', 'Lisaülesanne ei tule liiga tihedalt ega liiga aeglaselt'),
        new ScoreElement('Hea läbikukkumise tagasiside', 'Läbikukkumisel on hea animatsioon'),
        new ScoreElement('Heliline tagasiside', 'Tegevustel on heliline tagasiside'),
        new ScoreElement('Mängu õpitavus on hea', 'Lihtne on aru saada kuidas mängu mängida'),
        new ScoreElement('Sorditavaid objekte saab lohistada', 'Pole ainult klikitav lahendus'),
        new ScoreElement('Töötab ka mobiilil', 'Väikesel ekraanil ilma hiire ja klaviatuurita on võimalik mängida')
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
        new ScoreElement('Ootejärjekord', 'Oleks koht,<br> kus on mitu objekti,<br> mis ootavad sorteerimist'),
        new ScoreElement('Sorteerimine', 'Objekte saab klõpsides või lohistades viia oodatud kuhja'),
        new ScoreElement('Perioodiline lisaülesanne', 'Mingi aja tagant tuleb tavapärasest sorteerimisest teistsugune ülesanne'),
        new ScoreElement('Elude kaotamine', 'Valesti tehtud sorteerimise peale kaovad elud'),
        new ScoreElement('Mängu läbikukkumine ja kordamine', 'Elude otsalõppemisel tuleb mängu lõppemise ekraan,<br> kus on võimalik alustada uut mängu (ilma akent värskendamata)'),
        new ScoreElement('Tähelepanu juhtimine animatsioonidega', `Animatsiooniga on mingi tegevuse juurde juhitud tähelepanu.<br> Näiteks elude kaotamisel juhitakse tähelepanu elude juurde`),
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

Vue.directive('tooltip', {
    inserted: function (el, binding) {
        this.tooltipRef = new Tooltip(el, {
            placement: 'right',
            container: document.getElementById(binding.value.container),
            title: binding.value.text,
            html: true
        })
    }
})

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
        },
        scrollToHeading(headingNr) {
            var elements = document.getElementsByClassName('header-marker');
            if (this.isSmallScreen) {
                this.showMenu = false;
            }
            scrollIt(elements[headingNr], 200, 'easeOutQuad');
        },
        validateAndScroll() {
            this.group.validateStudents();
            if (!this.group.isStudentsValid) {
                this.scrollToHeading(0);
                return false;
            }
            this.group.project.base.validate();
            if (!this.group.project.base.isValid) {
                this.scrollToHeading(1);
                return false;
            }
            this.group.project.bonus.elements.forEach((e, i) => {
                e.validate();
                if (!e.isScoreValid || !e.isReasonValid) {
                    scrollIt(document.getElementById('bonusScore_' + i), 200, 'easeOutQuad');
                    return false;
                }
            });
            this.group.project.negative.elements.forEach((e, i) => {
                e.validate();
                if (!e.isScoreValid || !e.isReasonValid) {
                    scrollIt(document.getElementById('minusScore_' + i), 200, 'easeOutQuad');
                    return false;
                }
            });
            this.group.project.plagiarism.validate();
            if (!this.group.project.plagiarism.isValid) {
                this.scrollToHeading(6);
            }
            return true;
        },
        complete() {
            if (this.validateAndScroll()) {
                console.log('COMPLETED');
            }
        }
    },
    computed: {
    },
    mounted() {
        this.$nextTick(() => window.addEventListener('resize', (e) => {
            Vue.set(this, 'isSmallScreen', window.innerWidth < 1280);
        }))
    }
});

function scrollIt(destination, duration = 200, easing = 'linear', callback) {

    const easings = {
      linear(t) {
        return t;
      },
      easeInQuad(t) {
        return t * t;
      },
      easeOutQuad(t) {
        return t * (2 - t);
      },
      easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
      easeInCubic(t) {
        return t * t * t;
      },
      easeOutCubic(t) {
        return (--t) * t * t + 1;
      },
      easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      },
      easeInQuart(t) {
        return t * t * t * t;
      },
      easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
      },
      easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      },
      easeInQuint(t) {
        return t * t * t * t * t;
      },
      easeOutQuint(t) {
        return 1 + (--t) * t * t * t * t;
      },
      easeInOutQuint(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
      }
    };
  
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
  
    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
  
    if ('requestAnimationFrame' in window === false) {
      window.scroll(0, destinationOffsetToScroll);
      if (callback) {
        callback();
      }
      return;
    }
    function scroll() {
        const now = 'now' in window.performance ? performance.now() : new Date().getTime();
        const time = Math.min(1, ((now - startTime) / duration));
        const timeFunction = easings[easing](time);
        window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
    
        if (window.pageYOffset === destinationOffsetToScroll) {
          if (callback) {
            callback();
          }
          return;
        }
    
        requestAnimationFrame(scroll);
      }
    
      scroll();
    }
 