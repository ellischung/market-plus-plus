import React from "react";

const HomeFeed = ({
  craigslistHomeFeedData,
  facebookHomeFeedData,
  offerupHomeFeedData,
  displayResults,
}) => {
  return (
    <div className="feed-container">
      {/* shuffle combined array and call displayResults once */}
      {craigslistHomeFeedData && displayResults(craigslistHomeFeedData)}
      {facebookHomeFeedData && displayResults(facebookHomeFeedData)}
      {offerupHomeFeedData && displayResults(offerupHomeFeedData)}
    </div>
  );
};

export default HomeFeed;
