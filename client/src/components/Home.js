import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Card, CardMedia, Container, Box, Divider } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
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
  const [maxPrice, setMaxPrice] = useState(1000);
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

  // other initializations
  const location = useLocation();
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  const API = axios.create({ baseURL: "http://localhost:5000" });

  const handleSearch = (e) => {
    e?.preventDefault();

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

  const ListingCard = ({ listing }) => {
    // create unique id for listing
    const id = `${listing.url}$-filler-$${listing.title}$-filler-$${listing.imageUrl}`;
    const [isFavorite, setIsFavorite] = useState(
      user.result.liked_listings.includes(id)
    );

    const handleIconClick = (e) => {
      e.stopPropagation(); // to prevent the card click event from firing
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);

      // call the API to add/remove from favorites
      try {
        API.patch("/user/updateFavorite", {
          userId: user.result._id,
          listingHash: id,
          isFavorite: newFavoriteStatus,
        });
        // copy current user data
        let updatedUser = JSON.parse(JSON.stringify(user));

        if (newFavoriteStatus) {
          // if the listing was added to favorites, add it to the liked_listings array
          updatedUser.result.liked_listings.push(id);
        } else {
          // if the listing was removed from favorites, remove it from the liked_listings array
          updatedUser.result.liked_listings =
            updatedUser.result.liked_listings.filter(
              (listingId) => listingId !== id
            );
        }

        // update the user state with the updated user data
        setUser(updatedUser);
        // update the user data in local storage
        localStorage.setItem("profile", JSON.stringify(updatedUser));
      } catch (err) {
        console.error(err);
        setIsFavorite(!newFavoriteStatus); // revert the favorite state if the API call fails
      }
    };

    return (
      <Card
        className="itemContainer"
        onClick={() => window.open(listing.url, "_blank")}
      >
        <CardMedia
          component="img"
          alt="img"
          image={
            listing.imageUrl ? listing.imageUrl : require("../images/temp.jpg")
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
        <div onClick={handleIconClick}>
          {isFavorite ? (
            <FavoriteIcon sx={{ color: "#6cbad2" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "#6cbad2" }} />
          )}
        </div>
      </Card>
    );
  };

  const displayResults = (data) => {
    return data.map((listing) => (
      <Grid item>
        <ListingCard listing={listing} />
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
      </Container>
      <footer className="home-footer">
        <p>© 2023 market++</p>
      </footer>
    </>
  );
};

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
