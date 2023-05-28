import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Card, CardMedia, Container, Box, Divider } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Navbar from "./Navbar";
import Filters from "./Filters";
import Feed from "./Feed";
import decode from "jwt-decode";
import axios from "axios";
import LeftModal from "./LeftModal";
import "./Home.css";

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [input, setInput] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [postalCode, setPostalCode] = useState(10012);
  const [distance, setDistance] = useState(30);
  const [filters, setFilters] = useState({
    sortBy,
    minPrice,
    maxPrice,
    postalCode,
    distance,
  });
  const [craigslistData, setCraigslistData] = useState([]);
  const [ebayData, setEbayData] = useState([]);
  const [facebookData, setFacebookData] = useState([]);
  const [offerupData, setOfferupData] = useState([]);
  const [etsyData, setEtsyData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [checkedFilters, setCheckedFilters] = useState({
    "Facebook Marketplace": true,
    eBay: true,
    OfferUp: true,
    craigslist: true,
    Etsy: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const API = axios.create({ baseURL: "http://localhost:5000/search" });

  const handleSearch = (e) => {
    e.preventDefault();

    // search for craigslist
    API.get("/craigslistSearch", {
      params: {
        input: input,
        sortBy: sortBy,
        minPrice: minPrice,
        maxPrice: maxPrice,
        postalCode: postalCode,
        distance: distance,
      },
    })
      .then(({ data }) => {
        setCraigslistData(Object.values(data));
      })
      .catch(function (error) {
        console.log(error);
      });

    // search for ebay
    API.get(`/ebaySearch/${input}`)
      .then(({ data }) => {
        setEbayData(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // search for facebook marketplace
    API.get("/facebookSearch", {
      params: {
        input: input,
        sortBy: sortBy,
        minPrice: minPrice,
        maxPrice: maxPrice,
        postalCode: postalCode,
        distance: distance,
      },
    })
      .then(({ data }) => {
        setFacebookData(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // search for offerup
    API.get("/offerupSearch", {
      params: {
        input: input,
        sortBy: sortBy,
        minPrice: minPrice,
        maxPrice: maxPrice,
        postalCode: postalCode,
        distance: distance,
      },
    })
      .then(({ data }) => {
        setOfferupData(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // search for etsy
    API.get(`/etsySearch/${input}`)
      .then(({ data }) => {
        setEtsyData(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onCheckboxChange = (filterName, isChecked) => {
    const newCheckedFilters = { ...checkedFilters, [filterName]: isChecked };

    if (!isChecked) {
      const checkedFilterNames = Object.keys(checkedFilters).filter(
        (name) => checkedFilters[name]
      );

      const currentActiveFilterName = checkedFilterNames[activeTab];
      const newCheckedFilterNames = Object.keys(newCheckedFilters).filter(
        (name) => newCheckedFilters[name]
      );
      const newActiveTabIndex = newCheckedFilterNames.indexOf(
        currentActiveFilterName
      );

      if (newActiveTabIndex !== -1 && newActiveTabIndex !== activeTab) {
        setActiveTab(newActiveTabIndex);
      }
    }

    setCheckedFilters(newCheckedFilters);
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
          <div className="cardMeta">{listing.location}</div>
          <div className="cardMeta">{listing.platform}</div>
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

    // for any filter changes
    input != "" && handleSearch(event);
  }, [location, sortBy, minPrice, maxPrice]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar setInput={setInput} handleSearch={handleSearch} logout={logout} />
      <Container maxWidth="xl" className="container1">
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <LeftModal isOpen={isModalOpen} onClose={handleCloseModal} />
          <div className="innerContainer">
            <div className="btnContainer">
              <button className="filterButton" onClick={handleOpenModal}>
                Show Filters
              </button>
              <Divider sx={{ marginBottom: "10px" }} />
            </div>
            <div className="contentContainer">
              <div className="filter">
                <Filters
                  checkedFilters={checkedFilters}
                  onCheckboxChange={onCheckboxChange}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                />
              </div>
              <div className="feed">
                <Feed
                  craigslistData={craigslistData}
                  ebayData={ebayData}
                  facebookData={facebookData}
                  offerupData={offerupData}
                  etsyData={etsyData}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  checkedFilters={checkedFilters}
                  displayResults={displayResults}
                />
              </div>
            </div>
          </div>
        </Box>
      </Container>
    </>
  );
};

export default Home;
