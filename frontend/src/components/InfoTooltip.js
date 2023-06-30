import React from "react";
import success from "../images/success.svg";
import error from "../images/error.svg";
import usePopupClose from "../hooks/usePopupClose";

const InfoTooltip = ({isOpen, onClose, isRegister, alt }) => {
  usePopupClose(isOpen, onClose);

  return (

    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__content">
        <button
          className="popup__close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть окно"
        />
        <img
          className="popup__image-auth"
          src={isRegister.status ? success : error}
          alt={alt}
        />
        <h2 className="popup__title popup__title_auth">
          {isRegister.message}
        </h2>
      </div>
    </div>

  );
};

export default InfoTooltip;