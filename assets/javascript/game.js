var words = [
    {
        word: "apple",
        desc: "Fruit"
    },
    {
        word: "ford",
        desc: "Car maker"
    },
    {
        word: "orange",
        desc: "Fruit"
    },
    {
        word: "toyota",
        desc: "Car maker"
    },
    {
        word: "apricot",
        desc: "Fruit"
    },
    {
        word: "ferrari",
        desc: "Car maker"
    }
    
];

var imagesBasePath = "assets/images/";

var game = {
    winsCount: 0,
    lossesCount: 0,
    guessesRemainingCount: 8,
    guessesCount: 8,
    word: "",
    desc: "",
    dummy: "",
    wordLettersCount: 0,
    wrongLetters: [],

    isWin: false,
    isLost: false,
    
    helpElement: null,
    wordElement: null,
    wrongLettersElement: null,
    winsCountElement: null,
    guessesRemainingElement: null,
    imageElement: null,

    init: function() {
        var me = this;

        me.winsCount = 0;
        me.lossesCount = 0;

        me.helpElement = document.getElementById("help");
        me.wordElement = document.getElementById("word");
        me.wrongLettersElement = document.getElementById("wrongLetters");
        me.winsCountElement = document.getElementById("winsCount");
        me.guessesRemainingElement = document.getElementById("guessesRemainingCount");
        me.imageElement = document.getElementById("picture");
    },

    reset: function() {
        var me = this;

        me.guessesRemainingCount = me.guessesCount;
        me.word = "";
        me.dummy = "";
        me.wordLettersCount = 0;
        me.wrongLetters = [];
        me.isWin = false;
        me.isLost = false;
    },

    startNew: function(newWord, newDesc) {
        var me = this;

        me.reset();

        me.desc = newDesc;
        me.word = newWord;
        me.wordLettersCount = me.word.length;
        for (var i = 0; i < me.word.length; i++) {
            me.dummy += "_";
        }

        me.update();
    },

    guessLetter: function(letter) {
        var me = this;

        if (me.guessesRemainingCount <= 0) {
            return true;
        }

        // Check if letter is in wrongLetters
        if (me.wrongLetters.length > 0) {
            var existingWrongLetter = me.wrongLetters.find(v => v === letter);
            if (existingWrongLetter !== undefined) {
                return false;
            }
        }

        // Find letter in word
        var foundIndices = [];
        for (var i = 0; i < me.word.length; i++) {
            if (letter === me.word[i]) {
                foundIndices.push(i);
            }
        }
        if (foundIndices.length > 0) {
            var tempDummy = "";
            for (var i = 0; i < me.dummy.length; i++) {
                var foundIndex = foundIndices.find(v => v === i);
                if (foundIndex !== undefined) {
                    tempDummy += letter;
                }
                else {
                    tempDummy += me.dummy[i];
                }
            }
            me.dummy = tempDummy;
        }
        else {
            me.wrongLetters.push(letter);
            me.guessesRemainingCount--;
        }
        
        me.isLost = (me.guessesRemainingCount <= 0);
        me.isWin = (me.word === me.dummy);

        if (me.isWin) {
            me.winsCount++;
        }
        if (me.isLost) {
            me.lossesCount++;
        }

        me.update();

        if (me.isWin || me.isLost) {
            return true;
        }
        return false;
    },

    update: function() {
        var me = this;

        me.helpElement.innerHTML = me.desc;
        me.wordElement.innerHTML = me.dummy;
        me.wrongLettersElement.innerHTML = me.wrongLetters.join(",");
        me.wrongLettersElement.style.backgroundColor = "white";
        me.winsCountElement.innerHTML = me.winsCount + "&nbsp; / &nbsp;" + me.lossesCount;
        me.guessesRemainingElement.innerHTML = me.guessesRemainingCount;

        if (me.guessesRemainingCount === me.guessesCount) {
            me.imageElement.src = imagesBasePath + "picClear.jpeg";
        }
        else {
            var imageUrl = imagesBasePath + "pic" + (me.guessesCount - me.guessesRemainingCount) + ".jpeg";
            me.imageElement.src = imageUrl;
        }

        if (me.isWin) {
            me.wrongLettersElement.innerHTML = "<div>You won!</div><br><div style='font-size: 0.5em;'>Please press space bar to continue.</div>";
            me.wrongLettersElement.style.backgroundColor = "lightgreen";
        }
        if (me.isLost) {
            me.wrongLettersElement.innerHTML = "You lost!<br><p style='font-size: 0.5em;'>Please press space bar to continue.</p>";
            me.wrongLettersElement.style.backgroundColor = "pink";
        }
    }
};

var currentWordIndex = 0;
var isDoneWithCurrentWord = false;

var init = function() {
    currentWordIndex = getRandomIndex();
    isDoneWithCurrentWord = false;

    game.init();
    game.startNew(words[currentWordIndex].word, words[currentWordIndex].desc);
    currentWordIndex++;
}

init();

document.onkeyup = function(event) {
    var key = event.key.toLowerCase();
    
    if (isDoneWithCurrentWord === true) {
        if (key === " " && currentWordIndex < words.length) {
            game.startNew(words[currentWordIndex].word, words[currentWordIndex].desc);
            currentWordIndex = getRandomIndex();
            isDoneWithCurrentWord = false;
        }
        return;
    }

    var isOK = (key.length === 1 && key.match(/[a-z]/i));
    if (!isOK) {
        return;
    }

    isDoneWithCurrentWord = game.guessLetter(key);
};

function getRandomIndex() {
    return Math.floor(Math.random() * (words.length - 1 - 0) ) + 0;
  }