import React from "react";
import "./Filters.css";

const Filters = () => {
  return (
    <div className="filterContainer">
      <div className="containerTitle">Filters</div>
      <div className="filterTitle">Platforms</div>
      <div className="filterOption">Facebook Marketplace</div>
      <div className="filterOption">eBay</div>
      <div className="filterOption">OfferUp</div>
      <div className="filterOption">craigslist</div>
      <div className="filterTitle">Sort By</div>
      <div className="filterOption">Newest first</div>
      <div className="filterOption">Price - high to low</div>
      <div className="filterOption">Price - low to high</div>
      <div className="filterTitle">Price Range</div>
      <div className="filterTitle">Location</div>
      <div className="filterTitle">Distance</div>
    </div>
  );
};

export default Filters;
