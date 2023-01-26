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
          className="App"
          fill="#707c8b"
          paused={false}
          options={{
            height: 70,
            amplitude: 30,
            speed: 0.2,
            points: 3,
          }}
        />
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
