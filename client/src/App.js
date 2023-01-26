import React from "react";
import { HashRouter as Router, Route, NavLink } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import Wave from "react-wavify";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <img
          alt="market-plus-plus"
          src={require("./images/marketpluslogo3.png")}
          className="appLogo"
        />
        <Wave
          fill="url(#gradient)"
          paused={false}
          options={{
            height: 70,
            amplitude: 35,
            speed: 0.25,
            points: 4,
          }}
        >
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop offset="10%" stopColor="#b0c4de" />
              <stop offset="90%" stopColor="#76ABDF" />
            </linearGradient>
          </defs>
        </Wave>
        <div className="appForm">
          <div className="formTitle">
            <NavLink
              to="/login"
              activeClassName="formTitleLink-active"
              className="formTitleLink"
            >
              Log In
            </NavLink>{" "}
            or{" "}
            <NavLink
              exact
              to="/"
              activeClassName="formTitleLink-active"
              className="formTitleLink"
            >
              Sign Up
            </NavLink>
          </div>
          <Route exact path="/" component={SignUpForm} />
          <Route path="/login" component={LoginForm} />
        </div>
      </div>
    </Router>
  );
}

export default App;
