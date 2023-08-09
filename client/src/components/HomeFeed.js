import React from "react";

const HomeFeed = ({
  craigslistHomeFeedData,
  ebayHomeFeedData,
  facebookHomeFeedData,
  offerupHomeFeedData,
  etsyHomeFeedData,
  displayResults,
}) => {
  // combine all home feed data to one to be shuffled later
  const combinedFeed = React.useMemo(() => {
    let feeds = [
      ...craigslistHomeFeedData,
      ...ebayHomeFeedData,
      ...facebookHomeFeedData,
      ...offerupHomeFeedData,
      ...etsyHomeFeedData,
    ];

    // Knuth shuffle algorithm
    const shuffleFeed = (array) => {
      let currentIndex = array.length;
      let tempValue;
      let randomIndex;

      // swapping random and current index values
      while (currentIndex !== 0) {
        // pick random index
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // swap values
        tempValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempValue;
      }

      return array;
    };

    return shuffleFeed(feeds);
  }, [craigslistHomeFeedData, ebayHomeFeedData, facebookHomeFeedData, offerupHomeFeedData, etsyHomeFeedData]);

  return <div className="feed-container">{displayResults(combinedFeed)}</div>;
};

export default HomeFeed;
