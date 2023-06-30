import { useEffect } from "react";

const usePopupClose = (isOpen, closePopup) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closePopup();
      }
    };
    
    const handleOverlay = (event) => {
      if (event.target.classList.contains("popup_opened")) {
        closePopup();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOverlay);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOverlay);
    };
  }, [isOpen, closePopup]);
};

export default usePopupClose;
