import React from "react";
import { HashRouter as Router, Route, NavLink } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="appAside">
          <img
            alt="market-plus-plus"
            src={require("./images/test.png")}
            className="appLogo"
          />
        </div>
        <div className="appForm">
          <div className="pageSwitcher">
            <NavLink
              to="/login"
              activeClassName="pageSwitcherItem-active"
              className="pageSwitcherItem"
            >
              Log In
            </NavLink>
            <NavLink
              exact
              to="/"
              activeClassName="pageSwitcherItem-active"
              className="pageSwitcherItem"
            >
              Sign Up
            </NavLink>
          </div>

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
