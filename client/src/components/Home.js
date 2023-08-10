import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Container, Box, Divider } from "@mui/material";
import Navbar from "./Navbar";
import ListingCard from "./ListingCard";
import Filters from "./Filters";
import Feed from "./Feed";
import HomeFeed from "./HomeFeed";
import decode from "jwt-decode";
import axios from "axios";
import LeftModal from "./LeftModal";
import "./Home.css";

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [input, setInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [postalCode, setPostalCode] = useState(10012);
  const [distance, setDistance] = useState(30);
  const [activeTab, setActiveTab] = useState(0);
  const [craigslistData, setCraigslistData] = useState([]);
  const [ebayData, setEbayData] = useState([]);
  const [facebookData, setFacebookData] = useState([]);
  const [offerupData, setOfferupData] = useState([]);
  const [etsyData, setEtsyData] = useState([]);
  const [craigslistHomeFeedData, setCraigslistHomeFeedData] = useState([]);
  const [ebayHomeFeedData, setEbayHomeFeedData] = useState([]);
  const [facebookHomeFeedData, setFacebookHomeFeedData] = useState([]);
  const [offerupHomeFeedData, setOfferupHomeFeedData] = useState([]);
  const [etsyHomeFeedData, setEtsyHomeFeedData] = useState([]);
  const [checkedFilters, setCheckedFilters] = useState({
    "Facebook Marketplace": true,
    eBay: true,
    OfferUp: true,
    craigslist: true,
    Etsy: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // other initializations
  const location = useLocation();
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  const API = axios.create({ baseURL: "http://localhost:5000" });

  const handleHomeFeed = (e) => {
    if (e) e.preventDefault();

    API.get("/search/craigslistHomeFeed")
      .then(({ data }) => {
        setCraigslistHomeFeedData(Object.values(data).slice(0, 20));
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    API.get("/search/ebayHomeFeed")
      .then(({ data }) => {
        setEbayHomeFeedData(data);
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    API.get("/search/facebookHomeFeed")
      .then(({ data }) => {
        setFacebookHomeFeedData(Object.values(data).slice(0, 20));
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    API.get("/search/offerupHomeFeed")
      .then(({ data }) => {
        setOfferupHomeFeedData(Object.values(data).slice(0, 20));
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    API.get("/search/etsyHomeFeed")
      .then(({ data }) => {
        setEtsyHomeFeedData(data);
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const params = {
      input: input,
      sortBy: sortBy,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      postalCode: postalCode,
      distance: distance,
    };

    // search for craigslist
    API.get("/search/craigslistSearch", { params })
      .then(({ data }) => {
        setCraigslistData(Object.values(data));
      })
      .catch(function (error) {
        console.log(error);
      });

    // search for ebay
    API.get("/search/ebaySearch", { params })
      .then(({ data }) => {
        setEbayData(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // search for facebook marketplace
    API.get("/search/facebookSearch", { params })
      .then(({ data }) => {
        setFacebookData(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // search for offerup
    API.get("/search/offerupSearch", { params })
      .then(({ data }) => {
        setOfferupData(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // search for etsy
    API.get("/search/etsySearch", { params })
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
    return data.map((listing, index) => (
      <Grid item key={`${listing.title}${listing.platform}${index}`}>
        <ListingCard listing={listing} user={user} />
      </Grid>
    ));
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
    setUser(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // first useEffect to populate the home feed once
  useEffect(() => {
    handleHomeFeed();
  }, []); // empty dependency array => run once only on mount

  useEffect(() => {
    console.log(user);
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      //if token expired
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("profile")));

    // for any filter changes
    input != "" && handleSearch(event);
  }, [
    location,
    sortBy,
    debouncedMinPrice,
    debouncedMaxPrice,
    postalCode,
    distance,
  ]);

  return (
    <>
      <Navbar
        setInput={setInput}
        handleSearch={handleSearch}
        setHasSearched={setHasSearched}
        logout={logout}
      />
      <Container maxWidth="xl" className="container1">
        {hasSearched ? (
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
                    setPostalCode={setPostalCode}
                    setDistance={setDistance}
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
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <div className="contentContainer">
              <HomeFeed
                craigslistHomeFeedData={craigslistHomeFeedData}
                ebayHomeFeedData={ebayHomeFeedData}
                facebookHomeFeedData={facebookHomeFeedData}
                offerupHomeFeedData={offerupHomeFeedData}
                etsyHomeFeedData={etsyHomeFeedData}
                displayResults={displayResults}
              />
            </div>
          </Box>
        )}
      </Container>
      <footer className="home-footer">
        <p>Market++ | © 2023</p>
      </footer>
    </>
  );
};

// to delay handleSearch when user is editing price range
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default Home;
