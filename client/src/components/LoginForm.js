import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const LoginForm = () => {
  const API = axios.create({ baseURL: "http://localhost:5000/user" });
  const initialState = { email: "", password: "" };
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    API.post("/signin", formData).catch(function (error) {
      alert(error.request.response.replace(/['"]/g, ''));
    });

    console.log("The form was submitted with the following data:");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <form className="formFields" onSubmit={handleSubmit}>
      <div className="loginField">
        <TextField
          required
          name="email"
          label="Email Address"
          onChange={(event) => {
            handleChange(event);
          }}
        />
      </div>
      <div className="loginField">
        <TextField
          required
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          onChange={(event) => {
            handleChange(event);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
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
  );
};

export default LoginForm;
