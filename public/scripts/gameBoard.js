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
          "<div class='playingCards simpleCards' id='oppHand'>",
            "<div class='card back opponent'>*</div>", //oppCard
          "</div>",// oppHand
        "</div>", // /opponent
      "</div>", // /top

      //MIDDLE OF THE BOARD
      "<div class='container container-middle content'>",
        "<div class='oval'>",
          "<div class='playingCards'>",
            "<div class='play' id='tableCards'>",

              //PRIZE CARDS
              "<ul class='deck'>",
                "<li><div class='card back'>*</div></li>", //individual card ***** REMOVE AFTER
              "</ul>", //end prize deck

              // CURRENT PRIZE
              "<div class='card rank-1 spades'>",
                  "<span class='rank'>?</span>",
                  "<span class='suit'></span>",
              "</div>",

              // PLAYED CARD
              "<ul>",
                "<li>",
                  "<a class='card rank-2 diams' href='#'>", //artifical card ****** REMOVE
                    "<span class='rank'>2</span>",
                    "<span class='suit'>&diams;</span>",
                  "</a>",
                "</li>",
              "</ul>",


            "</div>", //playing cards in the center
        "</div>", //oval
      "</div>", // middle


      //BOTTOM
      "<div class='container container-bottom'>",
        "<div class='playingCards'>",
          "<ul class='hand' id='playerHand'></ul>",
          "<div class='clear'></div>", //clear
        "</div>",
      "</div>",
    "</div>" // /whole
  ].join("\n"));
  $( "section.board" ).append( emptyBoard ); //need to insert the name of the container

}
