import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("The form was submitted with the following data:");
  };

  return (
    <div className="formCenter">
      <form className="formFields">
        {/* <div className="formField">
          <input
            type="email"
            id="email"
            className="formFieldInput"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>

        <div className="formField">
          <input
            type="password"
            id="password"
            className="formFieldInput"
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div> */}
        <div className="loginFields">
          <TextField required id="outlined-required" label="Username" />
          <TextField required id="outlined-required" label="Password" />
        </div>

        <div className="formField">
          <button className="formFieldButton" onClick={handleSubmit}>
            Log In
          </button>
          <Link to="/" className="formFieldLink">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
