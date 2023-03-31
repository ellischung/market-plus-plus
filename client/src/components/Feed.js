import React from "react";
import { Grid } from "@mui/material";
import "./Feed.css";

const Feed = ({
  craigslistData,
  ebayData,
  facebookData,
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
      </Grid>
    </div>
  );
};

export default Feed;
