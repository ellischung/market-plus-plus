import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import "./App.css";

function App() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="App">
      <div className="container">
        <Typography>Market++</Typography>
        <TextField
          label="Username"
          variant="filled"
          onChange={(event) => {
            setUserName(event.target.value);
          }}
        />
        <TextField
          label="Password"
          variant="filled"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <Button variant="outlined">Sign In</Button>
      </div>
    </div>
  );
}

export default App;
