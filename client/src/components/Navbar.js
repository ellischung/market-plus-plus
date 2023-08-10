import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import "./Navbar.css";

const Navbar = ({ setInput, handleSearch, setHasSearched, logout }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openHome = () => (window.location.href = "/");

  const openProfile = () =>
    (window.location.href = `/favorites/${user?.result?.given_name.replace(
      /\s/g,
      ""
    )}`);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <AppBar position="fixed" sx={{ height: "8%", boxShadow: "none" }}>
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
          onClick={openHome}
        />
        <form
          onSubmit={(e) => {
            handleSearch(e);
            setHasSearched(true);
          }}
          className="navbar-search-form"
        >
          <div className="navbar-tb">
            <div className="navbar-td">
              <input
                type="text"
                placeholder="Search"
                required
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className="navbar-td navbar-search-cover">
              <button type="submit">
                <div className="navbar-search-circle"></div>
                <span></span>
              </button>
            </div>
          </div>
        </form>
        <div className="navBar-Right">
          <Tooltip title="Followed searches">
            <BookmarkIcon
              className="navbar-icon"
              sx={{ fontSize: "35px" }}
              onClick={logout}
            />
          </Tooltip>
          <Tooltip title="Favorites">
            <FavoriteIcon
              className="navbar-icon"
              sx={{ fontSize: "35px" }}
              onClick={openProfile}
            />
          </Tooltip>
          <AccountCircleIcon
            className="navbar-icon"
            sx={{ fontSize: "50px" }}
          />
          <MenuIcon className="hamburger" />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
