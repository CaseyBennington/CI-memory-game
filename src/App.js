import React, { useEffect, useState } from "react";
import Card from "./components/Card";
import "./App.css";

// random image API
// https://picsum.photos/${card.id}

// Fisher Yates Shuffle based function
function shuffleCards(array) {
  for (let i = array.length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

function App() {
  const [difficulty, setDifficulty] = useState("easy");
  const [cards, setCards] = useState([]);
  const [opened, setOpened] = useState([]); // using index
  const [matched, setMatched] = useState([]); // card.id
  const [moves, setMoves] = useState(0);
  const [winner, setWinner] = useState(false);

  // Create the card desk on load
  useEffect(() => {
    createCardDeck(6);
  }, []);

  // Hook to handle when the difficulty changes
  useEffect(() => {
    switch (difficulty) {
      case "hard":
        createCardDeck(12);
        break;
      case "medium":
        createCardDeck(9);
        break;
      default:
        createCardDeck(6);
    }
  }, [difficulty]);

  // check if there is a match
  // if there are 2 in the opened array, check if they match
  useEffect(() => {
    if (opened.length < 2) return;

    const firstCard = cards[opened[0]];
    const secondCard = cards[opened[1]];

    if (firstCard.name === secondCard.name)
      setMatched((matched) => [...matched, firstCard.id]);
  }, [cards, opened]);

  // clear cards after 2 have been selected
  useEffect(() => {
    if (opened.length === 2) setTimeout(() => setOpened([]), 800);
  }, [opened]);

  useEffect(() => {
    if (matched.length !== 0 && matched.length * 2 === cards.length) {
      setTimeout(() => {
        setWinner(true);
      }, 500);
    }
  }, [cards, matched]);

  // Change the difficulty and reset the board
  function handleDifficulty(e) {
    setDifficulty(e.target.value);
    handleReset();
  }

  // Create the random card deck based on the difficulty.
  function createCardDeck(num) {
    let cardDeck = [];

    for (let i = 1; i <= num; i++) {
      const cardName = `Image${i}`;
      const randomID = Math.floor(Math.random() * 5000) + 1;
      cardDeck.push({ id: randomID, name: cardName });
    }

    // creates the pairing of cards for the memory game
    setCards(shuffleCards([...cardDeck, ...cardDeck]));
  }

  // Flip the card
  function flipCard(index) {
    // if same card was clicked
    if (opened.includes(index)) return;

    setMoves((moves) => moves + 1);
    setOpened((opened) => [...opened, index]);
  }

  // Reset the game to play again
  function handleReset() {
    setMoves(0);
    setOpened([]);
    setMatched([]);
    setWinner(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Memory Game</h1>
      </header>
      <div className="options">
        <p>Pick your difficulty:</p>
        <select
          onChange={handleDifficulty}
          name="difficulty"
          value={difficulty}
          id="difficulty-select"
        >
          <option value="">--Please choose a difficulty--</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <p>
          {moves} <strong>moves</strong>
        </p>
      </div>
      <div className="cards">
        {cards.map((card, index) => {
          let isFlipped = false;

          // do some logic to check if flipped
          if (opened.includes(index)) isFlipped = true;
          if (matched.includes(card.id)) isFlipped = true;

          return (
            <Card
              key={index}
              index={index}
              card={card}
              isFlipped={isFlipped}
              flipCard={flipCard}
            />
          );
        })}
      </div>
      {winner && (
        <div className="winner">
          <p>You Won!</p>
          <button onClick={handleReset}>Play Again?</button>
        </div>
      )}
    </div>
  );
}

export default App;
