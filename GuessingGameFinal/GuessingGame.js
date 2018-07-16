function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.winningNumber - this.playersGuess);
};

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.checkGuess = function(guess) {
  //Return error if guess is invalid or duplicated.
  //If not, add to pastGuesses and check check if win or loss.
  //If neither, return helpful hints.

  if (!(guess>0 && guess<=100)) return "That is an invalid guess.";

  if (this.pastGuesses.includes(guess)) return "You have already guessed that number.";

  this.playersGuess = guess;
  this.pastGuesses.push(guess);

  var diff = this.difference();
  if (diff===0) return "You Win!";
  if (this.pastGuesses.length===5) return "You Lose.";
  if (diff<10) return "You're burning up!";
  if (diff<25) return "You're lukewarm.";
  if (diff<50) return "You're a bit chilly."
  else return "You're ice cold!"
}

Game.prototype.playersGuessSubmission = function() {
  // all jQuery here
  var guess = +$('#player-input').val();
  $('#player-input').val('');

  var output = this.checkGuess(guess);
  $('#title').text(output);

  if (output!=="That is an invalid guess."&&output!=="You have already guessed that number.") {
    $('#guess-list li:nth-child('+this.pastGuesses.length+')').text(this.playersGuess);

    if (output==="You Win!"||output==="You Lose.") {
      $('#subtitle').text('Click "Reset" to start a new game.')
      $('#submit, #hint-btn').attr('disabled', 'disabled');
    }
    else {
      if (this.isLower()) $('#subtitle').text("Try higher.");
      else $('#subtitle').text("Try lower.");
    }
  }
};

Game.prototype.provideHint = function() {
  this.hintArray = [this.winningNumber];
  for (var i = 1; i < 3; i++) {
    this.hintArray.push(generateWinningNumber());
  }
  return shuffle(this.hintArray);
};

/*HELPER FUNCTIONS*/
function generateWinningNumber() {
  var winningNumber = Math.round(Math.random() * 100);
  if (winningNumber===0) return 1;
  return winningNumber;
}

function shuffle(arr) {
  var m = arr.length, t, i;
  while (m) {
    // Pick a remaining index…
    i = Math.floor(Math.random() * m--);
    //store last elem value in variable t
    t = arr[m];
    //make last elem index hold value at random index
    arr[m] = arr[i];
    //make selected index hold last elem value stored in t
    arr[i] = t;
  }
  return arr;
}

function newGame() {
  return new Game();
}


/*JQUERY for checking document loaded and setting event handlers for buttons*/
$(document).ready(function() {
  var aGame = newGame();

  $('#submit').click(function() {
    aGame.playersGuessSubmission();
  });

  $('#player-input').keypress(function(char) {
    if (char.keyCode === 13) aGame.playersGuessSubmission();
  });

  $('#reset-btn').click(function() {
    aGame = newGame();
    $('#title').text('Play the Guessing Game!');
    $('#subtitle').text('Guess a number between 1-100!');
    $('.guess').text('-');
    $('#submit, #hint-btn').attr('disabled', false);
  });

  $('#hint-btn').click(function() {
    var hintArr = aGame.provideHint();
    $('#title').text(`One of these is the winning number:  ${hintArr.join(', ')}`);
  });
});
