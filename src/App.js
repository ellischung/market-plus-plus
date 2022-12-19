import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import "./App.css";

function App() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="App">
      <div className="container">
        <Typography className="title">Market++</Typography>
        <TextField
          className="input"
          label="Username"
          variant="filled"
          onChange={(event) => {
            setUserName(event.target.value);
          }}
        />
        <TextField
          className="input"
          label="Password"
          variant="filled"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <Button className="input" variant="outlined">
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default App;
