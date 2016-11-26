/*jshint esversion: 6 */
"use strict";

function createEmptyBoard() {
  const emptyBoard = $([

    //WHOLE CONTAINER
    "<div class='container wrapper board'>",

      // TOP OF THE BOARD
      "<div class='container container-top'>",
        "<div class='opponent'>",
          "<div class='playingCards inText' id='oppHand'>",
          "</div>",// oppHand
        "</div>", // /opponent
      "</div>", // /top

      //MIDDLE OF THE BOARD
      "<div class='container container-middle content'>",
        "<div class='oval center'>",


        //MIDDLE OF THE TABLE
          "<div class='playingCards'>",


            //OPPONENTS PLAYED CARD
            "<div class='opponentsPlayedCards center'>",
              "<div class='playingCards simpleCards'>",

                "<div class='card mystery'>", // BLANK CARD **** TODO:REMOVE
                  "<span class='rank'>?</span>",
                  "<span class='suit'></span>",
                "</div>",


              "</div>",
            "</div>",
            // /OPPONENTS PLAYED CARD


            //PRIZE CARDS

            "<div class='play' id='tableCards simpleCards'>",

              //PRIZE CARDS
              "<div class='prizeContainer'>",
                "<ul class='deck' id='prizeCards'></ul>",
              "</div>",

              // // CURRENT PRIZE
              // "<div class='card rank-1 spades'>",
              //     "<span class='rank'>?</span>",
              //     "<span class='suit'></span>",
              // "</div>",

              // PLAYER PLAYED CARD
              "<ul id='playerPlayedCards'></ul>",
              // /PLAYER PLAYED CARD





              "</div>", //playing cards in the center
          "</div>", //table cards
        "</div>", //oval
      "</div>",// middle

      //BOTTOM
      "<div class='container container-bottom'>",
        // "<div class='right'>",
        //   "<button class='btn right'>Bet</button>",
        // "</div>",

        "<div class='playingCards simpleCards' id='playerHand'>",
          // "<div class='clear'></div>", //clear
        "</div>",
      "</div>",
    "</div>" // /whole
  ].join("\n"));
  $( "section.board" ).append( emptyBoard ); //need to insert the name of the container
}
