import React from "react";

const HomeFeed = ({
  craigslistHomeFeedData,
  ebayHomeFeedData,
  facebookHomeFeedData,
  offerupHomeFeedData,
  etsyHomeFeedData,
  displayResults,
}) => {
  // memoize the feed to avoid reshuffling from parent component re-rendering
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

    // trim results to 80
    return shuffleFeed(feeds.slice(0, 80));
  }, [
    craigslistHomeFeedData,
    ebayHomeFeedData,
    facebookHomeFeedData,
    offerupHomeFeedData,
    etsyHomeFeedData,
  ]);

  return <div className="feed-container">{displayResults(combinedFeed)}</div>;
};

export default HomeFeed;
