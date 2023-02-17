import React from "react";
import { TextField, InputAdornment, IconButton, Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const LoginForm = ({
  error,
  handleChange,
  handleSubmit,
  signUpMode,
  handleClickShowPassword,
  handleMouseDownPassword,
  showPassword,
}) => {
  return (
    <form onSubmit={handleSubmit}>
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
        {error && <Alert className="alertStyle" severity="error">{error}</Alert>}
      </div>
      <div className="submitField">
        <button className="submitButton" type="submit">
          Log In
        </button>
        <div onClick={signUpMode} className="submitFieldLink">
          Create an account
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
