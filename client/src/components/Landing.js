import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import Wave from "react-wavify";
import "./Landing.css";
import axios from "axios";

const Landing = () => {
  const API = axios.create({ baseURL: "http://localhost:5000/user" });
  const initialState = { email: "", password: "" };
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [loginTitle, setLoginTitle] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

  useEffect(() => setUser(localStorage.getItem("profile")), [user]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isSignup) {
      API.post("/signin", formData)
        .catch(function (error) {
          setError(error.request.response.replace(/['"]/g, ""));
        })
        .then(({ data }) => {
          localStorage.setItem("profile", JSON.stringify(data));
          window.location.href = "/";
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    if (isSignup) {
      API.post("/signup", formData)
        .catch(function (error) {
          setError(error.request.response.replace(/['"]/g, ""));
        })
        .then(({ data }) => {
          localStorage.setItem("profile", JSON.stringify(data));
          window.location.href = "/";
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    console.log("The form was submitted with the following data:");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleShowModal = () => setShowModal(true);

  const handleHideModal = () => setShowModal(false);

  const loginMode = () => {
    setIsSignup(false);
    setLoginTitle(true);
    setError("");
  };

  const signUpMode = () => {
    setIsSignup(true);
    setLoginTitle(false);
    setError("");
  };

  return (
    <div className="appLanding">
      <img
        alt="market-plus-plus"
        src={require("../images/marketpluslogo.png")}
        className="appLogo"
      />
      <Wave
        className="appWave"
        fill="url(#gradient)"
        paused={false}
        options={{
          height: 70,
          amplitude: 20,
          speed: 0.4,
          points: 5,
        }}
      >
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(70)">
            <stop offset="10%" stopColor="#d3d3d3" />
            <stop offset="90%" stopColor="#a9a9a9" />
          </linearGradient>
        </defs>
      </Wave>
      <div className="appForm">
        <div className="formTitle">
          <div
            onClick={loginMode}
            className={loginTitle ? "formTitleLink-Active" : "formTitleLink"}
          >
            Log In
          </div>{" "}
          or{" "}
          <div
            onClick={signUpMode}
            className={!loginTitle ? "formTitleLink-Active" : "formTitleLink"}
          >
            Sign Up
          </div>
        </div>
        {isSignup ? (
          <SignUpForm
            error={error}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loginMode={loginMode}
            handleClickShowPassword={handleClickShowPassword}
            handleMouseDownPassword={handleMouseDownPassword}
            handleShowModal={handleShowModal}
            handleHideModal={handleHideModal}
            showPassword={showPassword}
            showModal={showModal}
          />
        ) : (
          <LoginForm
            error={error}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            signUpMode={signUpMode}
            handleClickShowPassword={handleClickShowPassword}
            handleMouseDownPassword={handleMouseDownPassword}
            showPassword={showPassword}
          />
        )}
      </div>
      <div className="emptySpace"></div>
    </div>
  );
};

export default Landing;
