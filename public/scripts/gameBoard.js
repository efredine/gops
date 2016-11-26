/*jshint esversion: 6 */
"use strict";

function createEmptyBoard() {
  console.log("Attempting to create an empty game board...");
  //var that contains the gameboard html

  const emptyBoard = $([

    //WHOLE CONTAINER
    "<div class='container wrapper'>",

      // TOP OF THE BOARD
      "<div class='container container-top'>",
        "<div class='opponent'>",
          "<div class='playingCards'>",
            "<ul class='deck' id='oppHand'></ul>",
          "</div>",// oppHand
        "</div>", // /opponent
      "</div>", // /top

      //MIDDLE OF THE BOARD
      "<div class='container container-middle content'>",
        "<div class='oval'>",
        //MIDDLE OF THE TABLE
          "<div class='playingCards'>",




            //OPPONENTS PLAYED CARD
            "<div class='opponentsPlayedCards center'>",
              "<div class='playingCards'>",
                "<div class='card little joker'>",
                  "<span class='rank'>-</span>",
                  "<span class='suit'>Joker</span>",
                "</div>",
              "</div>",
            "</div>",
            // /OPPONENTS PLAYED CARD


            //PRIZE CARDS

            "<div class='play' id='tableCards'>",

              //PRIZE CARDS
              "<div class='prizeContainer'>",
                "<ul class='deck' id='prizeCards'></ul>",
              "</div>",

              // // CURRENT PRIZE
              // "<div class='card rank-1 spades'>",
              //     "<span class='rank'>?</span>",
              //     "<span class='suit'></span>",
              // "</div>",

              // PLAYERS PLAYED CARD
              "<ul>",
                "<li>",
                  "<a class='card rank-2 diams' href='#'>", //artifical card ****** REMOVE
                    "<span class='rank'>2</span>",
                    "<span class='suit'>&diams;</span>",
                  "</a>",
                "</li>",
              "</ul>",
              // /PLAYERS PLAYED CARD





            "</div>", //playing cards in the center
        "</div>", //oval
      "</div>", // middle


      //BOTTOM
      "<div class='container container-bottom'>",
        "<div class='playingCards'>",
          "<ul class='hand' id='playerHand'><li><a class='card rank-7 diams' href='#'><span class='rank'>7</span><span class='suit'>&diams;</span></a></li></ul>", // ARTIFICAL CARD ******* REMOVE
          "<div class='clear'></div>", //clear
        "</div>",
      "</div>",
    "</div>" // /whole
  ].join("\n"));
  $( "section.board" ).append( emptyBoard ); //need to insert the name of the container

}
