import React, { useState, useEffect } from "react";
import { Grid, Card, CardMedia, Container, Box } from "@mui/material";
import Navbar from "./Navbar";
import decode from "jwt-decode";

const Favorites = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [input, setInput] = useState("");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
    setUser(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    console.log(user);
    const token = user.token;

    if (token) {
      const decodedToken = decode(token);

      //if expired date
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("profile")));

    // for any filter changes
    input != "" && handleSearch(event);
  }, []);

  const displayFavorites = () => {
    if (user && user.result && user.result.liked_listings) {
      return (
        <Grid container spacing={3}>
          {user.result.liked_listings.map((listing, index) => {
            const listingData = listing.split("$-filler-$");
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  className="itemContainer"
                  onClick={() => window.open(listingData[0], "_blank")}
                >
                  <CardMedia
                    component="img"
                    alt="img"
                    image={
                      listingData[2]
                        ? listingData[2]
                        : require("../images/temp.jpg")
                    }
                    sx={{ height: "15em", width: "15em" }}
                  />
                  <div className="cardTitle">{listingData[1]}</div>
                  <br />
                  <div className="cardPrice">
                    {listingData[3] ? listingData[3] : "No price listed"}
                  </div>
                  <div className="cardMeta">{listingData[4]}</div>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <Navbar setInput={setInput} handleSearch={handleSearch} logout={logout} />
      <Container maxWidth="xl" className="container2" sx={{ padding: "100px" }}>
        <Box>{displayFavorites()}</Box>
      </Container>
    </>
  );
};

export default Favorites;
