import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./Navbar.css";

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <img
          className="appBarLogo"
          alt="market-plus-plus"
          src={require("../images/marketpluslogo-nav.png")}
        />
        <Toolbar className="navBar">
          <div class="navBar-Center">
            <button class="btn-search">
              <SearchIcon />
            </button>
            <input
              type="text"
              class="input-search"
              placeholder="Type to Search..."
            />
          </div>
          <div className="navBar-Right">
            <button className="navBar-Button">Followed</button>
            <button className="navBar-Button">Liked</button>
            <AccountCircleIcon
              className="avatarIcon"
              sx={{ fontSize: "50px" }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
