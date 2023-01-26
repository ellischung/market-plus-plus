import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, InputAdornment, IconButton, Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const LoginForm = () => {
  const API = axios.create({ baseURL: "http://localhost:5000/user" });
  const initialState = { email: "", password: "" };
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    API.post("/signin", formData).catch(function (error) {
      setError(error.request.response.replace(/['"]/g, ""));
    });

    console.log("The form was submitted with the following data:");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <form className="formFields" onSubmit={handleSubmit}>
      <div className="inputFields">
        <TextField
          className="inputField"
          required
          name="email"
          label="Email Address"
          onChange={(event) => {
            handleChange(event);
          }}
        />
        <TextField
          className="inputField"
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
        {error ? <Alert severity="error">{error}</Alert> : ""}
      </div>
      <div className="submitField">
        <button className="submitButton" type="submit">
          Log In
        </button>
        <Link to="/" className="submitFieldLink">
          Create an account
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
