import React, { useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "../components/ImagePopup";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import api from "../utils/Api";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import { getContent, authorize, register } from "../utils/auth";
import InfoTooltip from "./InfoTooltip";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [selectedCard, setSelectedCard] = useState({ name: "", link: "" });
  const [cards, setCards] = useState([]);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const [isRegister, setIsRegister] = useState({
    status: "",
    message: "",
  });
  const [isOpenInfoTooltip, setIsOpenInfoTooltip] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserData(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  useEffect(() => {
    tokenCheck();
  }, []);

  function tokenCheck() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      getContent(jwt)
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.data.email);
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function signOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setEmail("");
    navigate("/sign-in", { replace: true });
  }

  function closeAllPopups() {
    setIsAvatarPopupOpen(false);
    setIsProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsOpenInfoTooltip(false);
  }

  function handleRegister(evt) {
    evt.preventDefault();
    const { password, email } = formValue;
    register(password, email)
      .then(() => {
        setFormValue({ email: "", password: "" });
        setIsOpenInfoTooltip(true);
        setIsRegister({
          status: true,
          message: "Вы успешно зарегистрировались!",
        });
        navigate("/sign-in", { replace: true });
      })
      .catch((err) => {
        setIsOpenInfoTooltip(true);
        setIsRegister({
          status: false,
          message: "Что-то пошло не так! Попробуйте ещё раз.",
        });
        console.log(err);
      });
  };

  function handleLogin(evt) {
    evt.preventDefault();
    const { password, email } = formValue;
    authorize(password, email)
      .then((data) => {
        setFormValue({ email: "", password: "" });
        setLoggedIn(true);
        setEmail(email);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        setIsOpenInfoTooltip(true);
        setIsRegister({
          status: false,
          message: "Что-то пошло не так! Попробуйте ещё раз.",
        });
        console.log(err);
      });
  };

  function handleEditProfileClick() {
    setIsProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }

  function handleUpdateUser(data) {
    api
      .changeUserData(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatar) {
    api
      .changeAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .addLikeAndRemove(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(userCard) {
    api
      .addCardtoServer(userCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header email={email} onSignOut={signOut} />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute
                  element={Main}
                  loggedIn={loggedIn}
                  onEditProfile={handleEditProfileClick}
                  onEditAvatar={handleEditAvatarClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardDelete={handleCardDelete}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  cards={cards}
                />
              }
            />

            <Route
              path="/sign-in"
              element={
                <Login
                  onLogin={handleLogin}
                  handleChange={handleChange}
                  formValue={formValue}
                  title="Вход"
                  buttonText="Войти"
                />
              }
            />

            <Route
              path="/sign-up"
              element={
                <Register
                  handleChange={handleChange}
                  onRegister={handleRegister}
                  formValue={formValue}
                  title={"Регистрация"}
                  buttonText={"Зарегистрироваться"}
                />
              }
            />

            <Route
              path="/*"
              element={
                loggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/sign-in" replace />
                )
              }
            />
          </Routes>

          {loggedIn && <Footer />}

          <InfoTooltip
            isRegister={isRegister}
            isOpen={isOpenInfoTooltip}
            onClose={closeAllPopups}
            alt={"Статус"}
          />

          <EditProfilePopup
            isOpen={isProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <EditAvatarPopup
            isOpen={isAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />

          <ImagePopup
            isOpen={isImagePopupOpen}
            onClose={closeAllPopups}
            card={selectedCard}
          />
        </div>
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
