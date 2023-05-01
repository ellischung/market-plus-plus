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
  const activeFilterNames = Object.keys(checkedFilters).filter(
    (filterName) => checkedFilters[filterName]
  );

  const numTabs = activeFilterNames.length;

  const handleTabClick = (index) => {
    if (index >= numTabs) {
      return;
    }
    setActiveTab(index);
  };

  const activeFilterName = activeFilterNames[activeTab];

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
        {activeFilterNames.map((filterName, index) => {
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
