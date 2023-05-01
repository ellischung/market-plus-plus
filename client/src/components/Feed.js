import React, { useState } from "react";
import { Grid } from "@mui/material";
import "./Feed.css";

const Feed = ({
  craigslistData,
  ebayData,
  facebookData,
  offerupData,
  etsyData,
  activeTab,
  setActiveTab,
  checkedFilters,
  displayResults,
}) => {
  const numTabs = Object.values(checkedFilters).filter(
    (checked) => checked
  ).length;

  const handleTabClick = (index) => {
    if (index >= numTabs) {
      return;
    }
    setActiveTab(index);
  };

  const activeFilterName = Object.keys(checkedFilters)[activeTab];

  const activeFilterData = {
    "Facebook Marketplace": facebookData,
    eBay: ebayData,
    OfferUp: offerupData,
    craigslist: craigslistData,
    Etsy: etsyData,
  }[activeFilterName];

  return (
    <div>
      {/* <Grid container spacing={5}>
        {!filters
          ? displayResults(craigslistData)
          : displayResults(craigslistData)}
      </Grid> */}
      {/* <Grid container spacing={5}>
        {displayResults(craigslistData)}
        {displayResults(ebayData)}
        {displayResults(facebookData)}
        {displayResults(offerupData)}
        {displayResults(etsyData)}
      </Grid> */}
      <div className="feed-tabs">
        {Object.entries(checkedFilters).map(([filterName, checked], index) => {
          if (!checked) {
            return null;
          }
          const isActive = index === activeTab;
          return (
            <div
              key={filterName}
              onClick={() => handleTabClick(index)}
              className={`feed-tab${isActive ? " active" : ""}`}
            >
              {filterName}
            </div>
          );
        })}
      </div>
      <div className="feed-content">
        {/* Render the content for the active tab */}
        {displayResults(activeFilterData)}
      </div>
    </div>
  );
};

export default Feed;
