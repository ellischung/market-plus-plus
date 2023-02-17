import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import Filters from "./Filters";
import Feed from "./Feed";
import "./Home.css";
import decode from "jwt-decode";

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
    setUser(null);
  };

  useEffect(() => {
    const token = user.token;

    if (token) {
      const decodedToken = decode(token);

      //if expired date
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  return (
    <div>
      <Navbar logout={logout} />
      <div className="container">
        <Filters />
        <Feed />
      </div>
    </div>
  );
};

export default Home;
