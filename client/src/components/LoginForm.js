import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "axios";

const LoginForm = () => {
  const API = axios.create({ baseURL: "http://localhost:5000/user" });
  const initialState = { email: "", password: "" };
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = (event) => {
    event.preventDefault();

    API.post("/signin", formData).catch(function (error) {
      alert(error.toJSON());
    });

    console.log("The form was submitted with the following data:");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="formCenter">
      <form className="formFields" onSubmit={handleSubmit}>
        <div className="loginFields">
          <TextField 
              required 
              id="outlined-required" 
              name="email"
              label="Email Address"
              onChange={(event) => {
                handleChange(event);
              }}
          />
          <TextField 
              required 
              id="outlined-required" 
              name="password"
              label="Password" 
              onChange={(event) => {
                handleChange(event);
              }}
          />
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
