import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "./Filters.css";

const Filters = () => {
  return (
    <div className="filterContainer">
      <div className="containerTitle">Filters</div>
      <div className="filterTitle">Platforms</div>
      <FormControlLabel
        control={<Checkbox value="facebook" defaultChecked />}
        label={<div className="filterOption">Facebook Marketplace</div>}
      />
      <FormControlLabel
        control={<Checkbox value="ebay" defaultChecked />}
        label={<div className="filterOption">eBay</div>}
      />
      <FormControlLabel
        control={<Checkbox value="offerup" defaultChecked />}
        label={<div className="filterOption">OfferUp</div>}
      />
      <FormControlLabel
        control={<Checkbox value="craigslist" defaultChecked />}
        label={<div className="filterOption">craigslist</div>}
      />
      <div className="filterTitle">Sort By</div>
      <RadioGroup defaultValue="newest">
        <FormControlLabel
          value="newest"
          control={<Radio />}
          label={<div className="filterOption">Newest first</div>}
        />
        <FormControlLabel
          value="htol"
          control={<Radio />}
          label={<div className="filterOption">Price - high to low</div>}
        />
        <FormControlLabel
          value="ltoh"
          control={<Radio />}
          label={<div className="filterOption">Price - low to high</div>}
        />
      </RadioGroup>
      <div className="filterTitle">Price Range</div>
      <div className="filterTitle">Location</div>
      <div className="filterTitle">Distance</div>
    </div>
  );
};

export default Filters;
