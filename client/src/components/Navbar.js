import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import "./Navbar.css";

const Navbar = ({ setInput, handleSearch, logout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <AppBar position="fixed" sx={{ height: "8%", zIndex: 1 }}>
      <Toolbar
        sx={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          className="appBarLogo"
          alt="market-plus-plus"
          src={require("../images/marketplacev4.png")}
        />
        <form class="navBar-Center" onSubmit={handleSearch}>
          <button class="btn-search">
            <SearchIcon />
          </button>
          <input
            type="text"
            class="input-search"
            placeholder="Type to Search..."
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
        <div className="navBar-Right">
          <button className="navBar-Button" onClick={logout}>
            Followed
          </button>
          <button className="navBar-Button">Liked</button>
          <AccountCircleIcon className="avatarIcon" sx={{ fontSize: "50px" }} />
          <MenuIcon className="hamburger"/>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
