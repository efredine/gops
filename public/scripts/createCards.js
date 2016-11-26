//decides suit of cards for each PLAYER
const suits = ["diams", "hearts", "spades", "clubs"];
const cardNumbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

function Shuffle(arrayOfCards) {
	for(var j, x, i = arrayOfCards.length; i; j = parseInt(Math.random() * i), x = arrayOfCards[--i], arrayOfCards[i] = arrayOfCards[j], arrayOfCards[j] = x);
	return arrayOfCards;
};

function newGame() {
  const newSuits = Shuffle(suits);
  const p1_suit = newSuits[0];
  const p2_suit = newSuits[1];
  const prize_suit = newSuits[2];

  //create whole hand for p1
  for (var p1Index = 1; p1Index < 14; p1Index += 1) {
    generatePlayerHand(p1_suit, p1Index);
  }

  //create hand for p2
  for (var p2Index = 1; p2Index < 14; p2Index += 1) {
    createOpponentHand(p2Index);
  }

  for (var prizeIndex = 1; prizeIndex < 14; prizeIndex += 1) {
    createRemainingPrizes(prizeIndex);
  }
  return;
}




function generatePlayerHand(p1_suit, cardNumber) {
	if (cardNumber === 1) {
		cardNumber = "A";
	}
	else if (cardNumber === 11) {
		cardNumber = "J"
	}
	else if (cardNumber === 12) {
		cardNumber = "Q";
	}
	else if (cardNumber === 13) {
		cardNumber = "K";
	}



	const newCard = $([
		`<a class='card rank-${cardNumber} ${p1_suit}' href='#'>`,
	    `<span class='rank'>${cardNumber}</span>`,
	    `<span class='suit'>&${p1_suit};</span>`,
		"</a>",

  ].join("\n"));
  $( "#playerHand" ).append( newCard );
  return;
}


//SHOWS CARDS REMAINING IN THE OPPONENT'S HAND
function createOpponentHand(cardNumber) {
  if (cardNumber === 1) {
    cardNumber = "A";
  }
  if (cardNumber === 11) {
    cardNumber = "J"
  }
  if (cardNumber === 12) {
    cardNumber = "Q";
  }
  if (cardNumber === 13) {
    cardNumber = "K";
  }
  const newOppCard = $(["<div class='card back'>*</div>"].join("\n"));
  $( "#oppHand" ).append( newOppCard );
  return;
}


function createRemainingPrizes(cardNumber) {
  if (cardNumber === 1) {
    cardNumber = "A";
  }
  else if (cardNumber === 11) {
    cardNumber = "J"
  }
  else if (cardNumber === 12) {
    cardNumber = "Q";
  }
  else if (cardNumber === 13) {
    cardNumber = "K";
  }
  const prizeCard = $([
    "<li><div class='card back'>*</div></li>"
  ].join("\n"));
  $( "#prizeCards" ).append( prizeCard );
  return;
}
