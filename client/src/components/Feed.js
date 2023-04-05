import React from "react";
import { Grid } from "@mui/material";
import "./Feed.css";

const Feed = ({
  craigslistData,
  ebayData,
  facebookData,
  offerupData,
  filters,
  displayResults,
}) => {
  return (
    <div className="feedContainer">
      {/* <Grid container spacing={5}>
        {!filters
          ? displayResults(craigslistData)
          : displayResults(craigslistData)}
      </Grid> */}
      <Grid container spacing={5}>
        {displayResults(craigslistData)}
        {displayResults(ebayData)}
        {displayResults(facebookData)}
        {displayResults(offerupData)}
      </Grid>
    </div>
  );
};

export default Feed;
