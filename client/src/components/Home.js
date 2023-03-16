import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Card, CardMedia } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Navbar from "./Navbar";
import Filters from "./Filters";
import Feed from "./Feed";
import decode from "jwt-decode";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [input, setInput] = useState("");
  const [craigslistData, setCraigslistData] = useState([]);
  const [ebayData, setEbayData] = useState([]);
  const [filters, setFilters] = useState({});
  const location = useLocation();

  const API = axios.create({ baseURL: "http://localhost:5000/search" });

  const handleSearch = (e) => {
    e.preventDefault();

    API.get(`/craigslistSearch/${input}`)
      .then(({ data }) => {
        setCraigslistData(Object.values(data));
      })
      .catch(function (error) {
        console.log(error);
      });

    API.get(`/ebaySearch/${input}`)
      .then(({data}) => {
        setEbayData(data);
      })
      .catch(function (error) {
        console.log(error)
      })
  };

  const displayResults = (data) => {
    return data.map((listing) => (
      <Grid item>
        <Card
          className="itemContainer"
          onClick={() => window.open(listing.url, "_blank")}
        >
          <CardMedia
            component="img"
            alt="img"
            image={
              listing.imageUrl
                ? listing.imageUrl
                : require("../images/temp.jpg")
            }
            sx={{ height: "15em", width: "15em" }}
          />
          <div className="cardTitle">{listing.title}</div>
          <br />
          <div className="cardPrice">
            {listing.price ? listing.price : "No price listed"}
          </div>
          <div className="cardMeta">{listing.dateAndLocation}</div>
          <FavoriteBorderIcon sx={{ color: "#6cbad2" }} />
        </Card>
      </Grid>
    ));
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
    <div className="container">
      <Navbar setInput={setInput} handleSearch={handleSearch} logout={logout}/>
      <Filters setFilters={setFilters} />
      <Feed
        craigslistData={craigslistData}
        ebayData={ebayData}
        filters={filters}
        displayResults={displayResults}
      />
    </div>
  );
};

export default Home;
