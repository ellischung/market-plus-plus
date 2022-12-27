import React from "react";
import { Router, Route, NavLink } from "react-router-dom";
// import { TextField, Button, Typography } from "@mui/material";
import SignUpForm from "./components/SignUpForm";
import SignInForm from "./components/SignInForm";
import "./App.css";

function App() {
  // const [userName, setUserName] = useState("");
  // const [password, setPassword] = useState("");

  return (
    // <Router basename="/">
      <div className="App">
        <div className="appAside" />
        <div className="appForm">
          <div className="pageSwitcher">
            <NavLink
              to="/sign-in"
              activeClassName="pageSwitcherItem-active"
              className="pageSwitcherItem"
            >
              Sign In
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
              to="/sign-in"
              activeClassName="formTitleLink-active"
              className="formTitleLink"
            >
              Sign In
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
          <Route path="/sign-in" component={SignInForm} />
        </div>
      </div>
    // </Router>
  );
}

export default App;
