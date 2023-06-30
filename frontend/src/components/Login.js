import React from "react";

const Login = ({ title, formValue, handleChange, onLogin, buttonText }) => {
  return (
    <div className="authorization">
      <h1 className="authorization__title">{title}</h1>
      <form className="authorization-form" onSubmit={onLogin}>
        <input
          className="authorization-form__input"
          name="email"
          placeholder="E-mail"
          type="email"
          value={formValue.email}
          onChange={handleChange}
          required
        ></input>
        <input
          className="authorization-form__input"
          name="password"
          value={formValue.password}
          onChange={handleChange}
          placeholder="Пароль"
          type="password"
          required
        ></input>
        <button
          className="authorization-form__button"
          type="submit"
          name="save"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default Login;
