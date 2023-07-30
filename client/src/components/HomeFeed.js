import React from "react";

const HomeFeed = ({ craigslistHomeFeedData, displayResults }) => {
  return (
    <div className="feed-container">
      {craigslistHomeFeedData && displayResults(craigslistHomeFeedData)}
    </div>
  );
};

export default HomeFeed;
