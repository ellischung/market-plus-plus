import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Checkbox,
  Typography,
  Modal,
  Box,
} from "@mui/material";
import webshopv1 from "../images/webshopv1.svg";
import onlineshopv1 from "../images/onlineshopv1.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./Landing.css";
import axios from "axios";

const Landing = () => {
  const API = axios.create({ baseURL: "http://localhost:5000/user" });
  const initialState = { email: "", password: "" };
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [loginTitle, setLoginTitle] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

  useEffect(() => setUser(localStorage.getItem("profile")), [user]);

  const myElement = useRef(null);

  const handleSignUp = () => {
    // Not only changes state to SignUp but also adds classList for animations
    // Add a class to the element
    setIsSignup(true);
    setError("");
    myElement.current.classList.add("sign-up-mode");
  };

  const handleSignIn = () => {
    setIsSignup(false);
    setError("");
    myElement.current.classList.remove("sign-up-mode");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isSignup) {
      API.post("/signin", formData)
        .catch(function (error) {
          setError(error.request.response.replace(/['"]/g, ""));
        })
        .then(({ data }) => {
          localStorage.setItem("profile", JSON.stringify(data));
          window.location.href = "/";
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    if (isSignup) {
      API.post("/signup", formData)
        .catch(function (error) {
          setError(error.request.response.replace(/['"]/g, ""));
        })
        .then(({ data }) => {
          localStorage.setItem("profile", JSON.stringify(data));
          window.location.href = "/";
        })
        .catch(function (error) {
          console.log(error);
        });
    }

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

  const loginMode = () => {
    setIsSignup(false);
    setLoginTitle(true);
    setError("");
  };

  const signUpMode = () => {
    setIsSignup(true);
    setLoginTitle(false);
    setError("");
  };

  return (
    <div className="container" ref={myElement}>
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleSubmit} className="sign-in-form">
            <img
              src={require("../images/marketplacev5.png")}
              className="image2"
              alt=""
            />
            <h2 className="title">Sign in</h2>
            <br />
            <TextField
              className="input-field"
              required
              name="email"
              label="Email Address"
              onChange={(event) => {
                handleChange(event);
              }}
              InputProps={{
                sx: {
                  backgroundColor: "#f0f0f0",
                  borderRadius: "55px",
                },
              }}
            />
            <br />
            <TextField
              className="input-field"
              required
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              onChange={(event) => {
                handleChange(event);
              }}
              InputProps={{
                sx: {
                  backgroundColor: "#f0f0f0",
                  borderRadius: "55px",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <>
                <br />{" "}
                <Alert className="alertStyle" severity="error">
                  {error}
                </Alert>
              </>
            )}
            <br />
            <button className="btn solid" type="submit">
              Log In
            </button>
          </form>

          <form onSubmit={handleSubmit} className="sign-up-form">
            <img
              src={require("../images/marketplacev5.png")}
              className="image2"
              alt=""
            />
            <h2 className="title">Sign up</h2>
            <br />
            <TextField
              className="input-field"
              required
              name="name"
              label="Full Name"
              onChange={(event) => {
                handleChange(event);
              }}
              InputProps={{
                sx: {
                  backgroundColor: "#f0f0f0",
                  borderRadius: "55px",
                },
              }}
            />
            <br />
            <TextField
              className="input-field"
              required
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              onChange={(event) => {
                handleChange(event);
              }}
              InputProps={{
                sx: {
                  backgroundColor: "#f0f0f0",
                  borderRadius: "55px",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <br />
            <TextField
              className="input-field"
              required
              name="email"
              label="Email Address"
              type="email"
              onChange={(event) => {
                handleChange(event);
              }}
              InputProps={{
                sx: {
                  backgroundColor: "#f0f0f0",
                  borderRadius: "55px",
                },
              }}
            />
            <br />
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
                  <Typography
                    onClick={handleShowModal}
                    className="checkBoxTermsLink"
                    component="span"
                  >
                    terms of service.
                  </Typography>
                </Typography>
                <Modal open={showModal} onClose={handleHideModal}>
                  <Box className="modalBox">
                    <Typography variant="h6" component="h2">
                      Terms & Conditions
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      If you use this site, you are responsible for maintaining
                      the confidentiality of your account and password and for
                      restricting access to your computer, and you agree to
                      accept responsibility for all activities that occur under
                      your account or password. You may not assign or otherwise
                      transfer your account to any other person or entity. You
                      acknowledge that we are not responsible for third party
                      access to your account that results from theft or
                      misappropriation of your account. We reserve the right to
                      refuse or cancel service, terminate accounts, or remove or
                      edit content in our sole discretion.
                    </Typography>
                  </Box>
                </Modal>
              </div>
              {error && (
                <Alert className="alertStyle" severity="error">
                  {error}
                </Alert>
              )}
            </div>
            <br />
            <button className="btn" type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>The best shopping experience</h3>
            <p>
              All your favorite popular online shopping platforms all in one
              place.
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={handleSignUp}
            >
              Sign up
            </button>
          </div>
          <img src={webshopv1} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Already signed up ?</h3>
            <p>Sign in to begin searching!</p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={handleSignIn}
            >
              Sign in
            </button>
          </div>
          <img src={onlineshopv1} className="image" alt="" />
        </div>
      </div>
      <footer className="landing-footer">
        <p>Market++ | © 2023</p>
      </footer>
    </div>
  );
};

export default Landing;
