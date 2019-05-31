var words = [
    {
        word: "apple",
        desc: "Fruit"
    },
    {
        word: "toyota",
        desc: "Car maker"
    }
];

var game = {
    winsCount: 0,
    guessesRemainingCount: 10,
    word: "",
    dummy: "",
    wordLettersCount: 0,
    wrongLetters: [],
    
    wordElement: null,
    wrongLettersElement: null,
    winsCountElement: null,
    guessesRemainingElement: null,

    init: function() {
        var me = this;

        me.winsCount = 0;

        me.wordElement = document.getElementById("word");
        me.wrongLettersElement = document.getElementById("wrongLetters");
        me.winsCountElement = document.getElementById("winsCount");
        me.guessesRemainingElement = document.getElementById("guessesRemainingCount");
    },

    reset: function() {
        var me = this;

        me.guessesRemainingCount = 10;
        me.word = "";
        me.dummy = "";
        me.wordLettersCount = 0;
        me.wrongLetters = [];
    },

    startNew: function(newWord) {
        var me = this;

        me.reset();

        me.word = newWord;
        me.wordLettersCount = me.word.length;
        for (var i = 0; i < me.word.length; i++) {
            me.dummy += "_";
        }

        me.update();
    },

    guessLetter: function(letter) {
        var me = this;

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
        
        var isLost = (guessesRemainingCount <= 0);
        var isWin = (me.word === me.dummy);

        if (isWin) {
            me.winsCount++;
        }

        me.update();

        if (isWin || isLost) {
            return true;
        }
        return false;
    },

    update: function() {
        var me = this;

        me.wordElement.innerHTML = me.dummy;
        me.wrongLettersElement.innerHTML = me.wrongLetters.join(",");
        me.winsCountElement.innerHTML = me.winsCount;
        me.guessesRemainingElement.innerHTML = me.guessesRemainingCount;
    }
};

var currentWordIndex = 0;
var isDoneWithCurrentWord = false;

game.init();
game.startNew(words[currentWordIndex++].word);

document.onkeyup = function(event) {
    var key = event.key.toLowerCase();
    
    if (isDoneWithCurrentWord === true) {
        if (key === " " && currentWordIndex < words.length) {
            game.startNew(words[currentWordIndex++].word);
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