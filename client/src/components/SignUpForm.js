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
          <TextField required id="outlined-required" label="Username" />
          <TextField required id="outlined-required" label="Password" />
          <TextField required id="outlined-required" label="Email Address" />
        </div>
        {/* <input
            type="text"
            id="name"
            className="formFieldInput"
            placeholder="Enter your full name"
            name="name"
            onChange={(event) => {
              handleChange(event);
            }}
          /> */}
        {/* <input
            type="password"
            id="password"
            className="formFieldInput"
            placeholder="Enter your password"
            name="password"
            onChange={(event) => {
              handleChange(event);
            }}
          /> */}
        {/* <input
            type="email"
            id="email"
            className="formFieldInput"
            placeholder="Enter your email"
            name="email"
            onChange={(event) => {
              console.log(event.target.value);
              handleChange(event);
            }}
          /> */}

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
