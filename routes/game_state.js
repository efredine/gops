
const sampleGameState = {
  // first user is the current user - the one playing the game.
  users: [
    {
      userId: 37,
      userName: "Alice",
      score: 42,
      cardsInHand: [2, 3, 6, 7, 8, 9, 10]
    },
    {
      userId: 55,
      userName: "Bob",
      score: 3,
      cardsInHand: [1, 4, 5, 6, 7, 8, 9, 10]
    }
  ],
  turns: [
    {
      cardsPlayed: [1, 3],
      prize: 2
    },
    {
      cardsPlayed: [5, 2],
      prize: 4
    },
    {
      cardsPlayed: [null, null],
      prize: 5
    }
  ]
};
