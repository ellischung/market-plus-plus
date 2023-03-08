import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import Filters from "./Filters";
import Feed from "./Feed";
import "./Home.css";
import decode from "jwt-decode";
import axios from "axios";

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [input, setInput] = useState("");
  const [craigslistData, setCraigslistData] = useState([]);
  const [filters, setFilters] = useState({});
  const location = useLocation();

  const API = axios.create({ baseURL: "http://localhost:5000/search" });

  const handleSearch = (e) => {
    e.preventDefault();

    API.get(`/craigslistSearch/${input}`)
      .then(({ data }) => {
        setCraigslistData(Object.entries(data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
      <Navbar setInput={setInput} handleSearch={handleSearch} logout={logout} />
      <div className="container">
        <Filters setFilters={setFilters} />
        <Feed craigslistData={craigslistData} filters={filters} />
      </div>
    </div>
  );
};

export default Home;
