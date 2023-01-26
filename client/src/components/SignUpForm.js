import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const SignUpForm = () => {
  const API = axios.create({ baseURL: "http://localhost:5000/user" });
  const initialState = { name: "", password: "", email: "" };
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    API.post("/signup", formData).catch(function (error) {
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
      <div className="signUpFields">
        <TextField
          className="inputField"
          required
          name="name"
          label="Full Name"
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
        <TextField
          className="inputField"
          required
          name="email"
          label="Email Address"
          type="email"
          onChange={(event) => {
            handleChange(event);
          }}
        />
      </div>
      <div className="inputFields">
        <FormControlLabel
          control={
            <Checkbox
              required
              onChange={(event) => {
                handleChange(event);
              }}
            />
          }
          label={
            <Typography className="checkBoxText">
              I agree with all statements in the
              <a href="null" className="checkBoxTermsLink">
                terms of service
              </a>
            </Typography>
          }
        />
        {error ? <Alert severity="error">{error}</Alert> : <br />}
      </div>
      <div className="submitField">
        <button className="submitButton" type="submit">
          Sign Up
        </button>
        <Link to="/login" className="submitFieldLink">
          I'm already a member
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
