import React from "react";
import { Grid } from "@mui/material";
import "./Feed.css";

const Feed = ({ craigslistData, filters }) => {
  const displayResults = (data) => {
    return data.map((listing) => (
      <Grid item>
        <div
          className="itemContainer"
          onClick={() => window.open(listing[1].url, "_blank")}
        >
          <img
            style={{ width: "250px" }}
            alt="temp"
            src={listing[1].imageUrl}
          />
          <text style={{ fontSize: "1.4em" }}>{listing[1].title}</text>
          <text style={{ fontSize: "1em" }}>{listing[1].price}</text>
        </div>
      </Grid>
    ));
  };

  return (
    <div className="feedContainer">
      <Grid container spacing={5}>
        {!filters
          ? displayResults(craigslistData)
          : displayResults(craigslistData)}
      </Grid>
    </div>
  );
};

export default Feed;
