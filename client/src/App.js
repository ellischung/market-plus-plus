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
