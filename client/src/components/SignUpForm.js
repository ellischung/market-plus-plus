import React from "react";
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

const SignUpForm = ({
  error,
  handleChange,
  handleSubmit,
  loginMode,
  handleClickShowPassword,
  handleMouseDownPassword,
  handleShowModal,
  handleHideModal,
  showPassword,
  showModal,
}) => {
  return (
    <form onSubmit={handleSubmit}>
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
        {error && <Alert className="alertStyle" severity="error">{error}</Alert>}
      </div>
      <div className="submitField">
        <button className="submitButton" type="submit">
          Sign Up
        </button>
        <div onClick={loginMode} className="submitFieldLink">
          I'm already a member
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
