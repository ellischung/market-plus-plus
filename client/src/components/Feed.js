import React from "react";
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

  // Set a default value for activeTab
  if (activeTab === null || activeTab >= numTabs) {
    setActiveTab(0);
  }

  const activeFilterName = activeFilterNames[activeTab];

  const activeFilterData = checkedFilters[activeFilterName]
    ? {
        "Facebook Marketplace": facebookData,
        eBay: ebayData,
        OfferUp: offerupData,
        craigslist: craigslistData,
        Etsy: etsyData,
      }[activeFilterName]
    : null;

  const showTabs =
    facebookData != "" ||
    ebayData != "" ||
    offerupData != "" ||
    craigslistData != "" ||
    etsyData != "";

  return (
    <div className="feed-container">
      <div className="feed-tabs">
        {showTabs &&
          activeFilterNames.map((filterName, index) => {
            const isActive = index === activeTab;
            return (
              <div
                key={filterName}
                onClick={() => setActiveTab(index)}
                className={`feed-tab${isActive ? " active" : ""}`}
              >
                {filterName}
              </div>
            );
          })}
      </div>
      <div className="feed-content">
        {/* Render the content for the active tab */}
        {activeFilterData && displayResults(activeFilterData)}
      </div>
    </div>
  );
};

export default Feed;
