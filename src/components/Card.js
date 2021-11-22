import React from "react";

function Card({ index, card, isFlipped, flipCard }) {
  return (
    <button
      className={`memory-card ${isFlipped ? "flipped" : ""}`}
      onClick={() => flipCard(index)}
    >
      <div className="inner">
        <div className="front">
          <img src={`https://picsum.photos/${card.id}`} alt={card.name} />
        </div>
        <div className="back" />
      </div>
    </button>
  );
}

export default Card;
