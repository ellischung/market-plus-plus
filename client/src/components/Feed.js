import React from "react";
import { Grid } from "@mui/material";
import "./Feed.css";

const Feed = ({ craigslistData, filters, displayResults }) => {
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
