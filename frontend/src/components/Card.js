import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ onCardClick, card, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((item) => item._id === currentUser._id);
  const cardLikeButtonClassName = `cards__like-button ${
    isLiked && "cards__like-button_liked"
  }`;

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  function handleImageClick() {
    onCardClick(card);
  }

  return (
    <li className="cards__element">
      {isOwn && (
        <button
          className="cards__delete-button"
          aria-label="Удалить фотографию"
          onClick={handleDeleteClick}
        />
      )}
      <img
        className="cards__image"
        src={card.link}
        alt={card.name}
        onClick={handleImageClick}
      />
      <div className="cards__info">
        <h2 className="cards__name">{card.name}</h2>
        <button
          className={cardLikeButtonClassName}
          aria-label="Поставить лайк"
          type="button"
          onClick={handleLikeClick}
        />
        <p className="cards__like-counter">{card.likes.length}</p>
      </div>
    </li>
  );
}

export default Card;
