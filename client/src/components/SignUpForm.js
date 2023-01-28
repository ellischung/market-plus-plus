import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Checkbox,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Modal,
  Box,
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
  const [showModal, setShowModal] = useState(false);

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

  const handleShowModal = () => setShowModal(true);

  const handleHideModal = () => setShowModal(false);

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
        <div className="checkBoxFields">
          <Checkbox
            required
            onChange={(event) => {
              handleChange(event);
            }}
          />
          <Typography className="checkBoxText">
            I agree with all statements in the{" "}
            <Typography onClick={handleShowModal} className="checkBoxTermsLink">
              terms of service.
            </Typography>
          </Typography>
          <Modal open={showModal} onClose={handleHideModal}>
            <Box className="modalBox">
              <Typography variant="h6" component="h2">
                Terms & Conditions
              </Typography>
              <Typography sx={{ mt: 2 }}>
                If you use this site, you are responsible for maintaining the
                confidentiality of your account and password and for restricting
                access to your computer, and you agree to accept responsibility
                for all activities that occur under your account or password.
                You may not assign or otherwise transfer your account to any
                other person or entity. You acknowledge that we are not
                responsible for third party access to your account that results
                from theft or misappropriation of your account. We reserve the
                right to refuse or cancel service, terminate accounts, or remove
                or edit content in our sole discretion.
              </Typography>
            </Box>
          </Modal>
        </div>
        {error ? <Alert severity="error">{error}</Alert> : <br />}
      </div>
      <div className="submitField">
        <button className="submitButton" type="submit">
          Sign Up
        </button>
        <Link to="/" className="submitFieldLink">
          I'm already a member
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
