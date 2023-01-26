import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "axios";

const SignUpForm = () => {
  const API = axios.create({ baseURL: "http://localhost:5000/user" });
  const initialState = { name: "", password: "", email: "", hasAgreed: false };
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = (event) => {
    event.preventDefault();

    API.post("/signup", formData);

    console.log("The form was submitted with the following data:");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="formCenter">
      <form className="formFields" onSubmit={handleSubmit}>
        <div className="signUpFields">
          <TextField 
              required 
              id="outlined-required" 
              name="name"
              label="Full Name" 
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
          <TextField 
              required 
              id="outlined-required" 
              name="email"
              label="Email Address" 
              onChange={(event) => {
                handleChange(event);
              }}
          />
        </div>
        <div className="formField">
          <label className="formFieldCheckboxLabel">
            <input
              className="formFieldCheckbox"
              type="checkbox"
              name="hasAgreed"
              // value={hasAgreed}
              onChange={(event) => {
                handleChange(event);
              }}
            />{" "}
            I agree all statements in the
            <a href="null" className="formFieldTermsLink">
              terms of service
            </a>
          </label>
        </div>

        <div className="formField">
          <button className="formFieldButton" type="submit">
            Sign Up
          </button>
          <Link to="/login" className="formFieldLink">
            I'm already a member
          </Link>
        </div>
      </form>
    </div>
  );
};
export default SignUpForm;
