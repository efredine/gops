
// CREATES A NEW CARD TO ADD TO PLAYER HAND
function generatePlayerCard(card) { //*****throwing in artifical information for testing
  console.log("Creating new player card.");

  const newCard = $([
    //card must be placed (appended) into an already existing <ul>CARD GOES HERE</ul>
    "<li>",
      "<a class='card rank-A diams' href='#'>", // TODO: need to add href TODO: REPLACE DIV CLASS
        "<span class='rank'>A</span>",
        "<span class='suit'>&diams;</span>",
      "</a>",
    "</li>"
  ].join("\n"));
  $( "#playerHand" ).append( newCard );
}




// FUNCTION THAT SHOWS THE NUMBER OF CARDS REMAINING IN THE OPPONENT'S HAND
function createOpponentHand(num) {
  console.log("Attempting to add new card to opponents hand.");

  for (var i = 0; i < num; i += 1) {

    const newOppCard = $([
      "<li><div class='card back'>*</div></li>"
    ].join("\n"));

    $( "#oppHand" ).append( newOppCard );
  };

}


function createRemainingPrizes(number) {
  for (var prizeIndex = 0; prizeIndex < number; prizeIndex += 1) {

    const prizeCard = $([
      "<li><div class='card back'>*</div></li>"
    ].join("\n"));

    $( "#prizeCards" ).append( prizeCard );
  };
}
