import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Divider } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Slider from "@mui/material/Slider";
import "./Filters.css";

const Filters = ({ checkedFilters, onCheckboxChange }) => {
  const handleCheckboxChange = (event) => {
    const filterName = event.target.name;
    const isChecked = event.target.checked;
    onCheckboxChange(filterName, isChecked);
  };

  return (
    <div className="wrap">
      <div className="filterContainer">
        <div className="filterTitle">Platforms</div>
        <Divider sx={{ marginBottom: "1em" }} />
        {Object.entries(checkedFilters).map(([filterName, checked]) => (
          <FormControlLabel
            key={filterName}
            control={
              <Checkbox
                sx={{ padding: 0, marginRight: "0.5em", marginLeft: "0.5em" }}
                type="checkbox"
                name={filterName}
                checked={checked}
                onChange={handleCheckboxChange}
              />
            }
            label={<div className="filterOption">{filterName}</div>}
          />
        ))}
        <div className="filterTitle">Sort By</div>
        <Divider sx={{ marginBottom: "1em" }} />
        <RadioGroup defaultValue="newest">
          <FormControlLabel
            value="newest"
            control={
              <Radio
                sx={{ padding: 0, marginRight: "0.5em", marginLeft: "0.5em" }}
              />
            }
            label={<div className="filterOption">Newest first</div>}
          />
          <FormControlLabel
            value="htol"
            control={
              <Radio
                sx={{ padding: 0, marginRight: "0.5em", marginLeft: "0.5em" }}
              />
            }
            label={<div className="filterOption">Price - high to low</div>}
          />
          <FormControlLabel
            value="ltoh"
            control={
              <Radio
                sx={{ padding: 0, marginRight: "0.5em", marginLeft: "0.5em" }}
              />
            }
            label={<div className="filterOption">Price - low to high</div>}
          />
        </RadioGroup>
        <div className="filterTitle">Price Range</div>
        <Divider sx={{ marginBottom: "1em" }} />
        <Box className="priceRangeContainer">
          <TextField
            label={<div className="filterOption">Min</div>}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <div className="priceRangeSeparator">-</div>
          <TextField
            label={<div className="filterOption">Max</div>}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Box>
        <div className="filterTitle">Location</div>
        <Divider sx={{ marginBottom: "1em" }} />
        <TextField label="Ex: New York" />
        <div className="filterTitle">Distance</div>
        <Divider />
        <br />
        <Slider
          className="filterSlider"
          defaultValue={30}
          valueLabelDisplay="auto"
          step={10}
          min={10}
          max={110}
        />
        {/* <button className="submitButton" type="submit">
          Apply Filters
        </button> */}
      </div>
    </div>
  );
};

export default Filters;
