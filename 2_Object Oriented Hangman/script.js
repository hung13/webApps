var wordLst = ['whey', 'strepor', 'isometric', 'zendo', 'wallaby'];
var usedLetters = [];
var remainingTries = 8;
var answer;

function Answer(secret){
  this.word = secret;
  
  this.setWordArr = function(){
    var temp =[];
    for (var i = 0; i < this.word.length; i++){
      temp.push(this.word[i]);
    }
    return temp;
  };
  
  this.wordArr = this.setWordArr();

  this.setAnsArr = function(){
    var temp = [];
    for (var i = 0; i < this.wordArr.length; i++){
      temp[i] = '_';
    }
    return temp;
  };

  this.answerArr = this.setAnsArr();

  this.setLetters = function(){
    return this.word.length;
  }

  this.remainingLetters = this.setLetters();
}// end of Answer object

function chooseWord(){
  var size = wordLst.length;
  var i = Math.floor(Math.random() * size);
  return wordLst[i];
}

function setUp(){
  var rand = chooseWord();
  answer = new Answer(rand);
}

function wrongMsg(){
  alert("Incorrect guess, remaining attempt(s): " + remainingTries);
}

function winMsg(){
  alert("Congratulations! You've guess the word: " + answer.word);
}

function loseMsg(){  
  alert("You didn't guess the word: " + answer.word);
  console.log(" O");
  console.log("/I\\");
  console.log("/ \\");
}

function notUsed(guess){
  // no penalty for guessing the same letter twice
  if (usedLetters.includes(guess)){
    alert("You have already guessed that letter");
    return false;
  }
  //update letter use 
  usedLetters.push(guess);
  return true;
}

function notWrong(guess){
  if (!answer.wordArr.includes(guess)){
    remainingTries--;
    wrongMsg();
    return false;
  } return true;
}

function guessLetter(guess){
  for (var i = 0; i < answer.wordArr.length; i++){
    if (answer.wordArr[i] === guess){
      answer.answerArr[i] = guess;
      answer.remainingLetters--;
      alert("Congrats, you've found a letter: " + answer.answerArr.join(""));
    }
  }
}


function getGuess(){
  return prompt('Please enter a letter; click cancel to quit game\n' + usedLetters.join(",") + '\n' + answer.answerArr.join(""));
}

//make sure user enter a letter, in lowercase, 
//that hasnt been used and is not wrong
function validate(guess){
  if (guess.length === 1){
    guess.toLowerCase();
    if (notUsed(guess)){ 
      if (notWrong(guess)){
        guessLetter(guess);
      }
    }
  }
}

function checkWin(){    
  //if all letters have been guess, 
  if (answer.remainingLetters === 0){
    winMsg();
  } 
  //if no more tries, print hangman to show user has lost
  if (remainingTries === 0){
    loseMsg();
  }
}

function gameLoop(){
  //while letters still remain and player still have tries
  while(answer.remainingLetters > 0 && remainingTries > 0){
    var guess = getGuess();
    //clicking cancel or submitting nothing will exit game
    if (guess === null || guess === '') return;
    else{ validate(guess);}
    checkWin();
  }
}

setUp();
gameLoop();