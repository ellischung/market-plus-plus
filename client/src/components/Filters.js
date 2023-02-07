import React from "react";

const Filters = () => {
  return (
    <div style={{display:"flex", flexDirection:"column"}}>
      <div>Filters:</div>
      <br />
      <div>Platforms:</div>
      <div>facebook marketplace</div>
      <div>eBay</div>
      <div>OfferUp</div>
      <div>craigslist</div>
      <br />
      <div>Sort By:</div>
      <div>Price - high to low</div>
      <div>Price - low to high</div>
      <div>date added</div>
      <br />
      <div>Price Range:</div>
    </div>
  );
};

export default Filters;