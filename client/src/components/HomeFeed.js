import React from "react";

const HomeFeed = ({
  craigslistHomeFeedData,
  facebookHomeFeedData,
  offerupHomeFeedData,
  displayResults,
}) => {
  // combine all home feed data to one to be shuffled later
  let combinedFeed = [
    ...craigslistHomeFeedData,
    ...facebookHomeFeedData,
    ...offerupHomeFeedData,
  ];

  // shuffle feed to have a random order
  const shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // swapping random and current index values
    while (0 !== currentIndex) {
      // pick random index
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // swap values
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  return (
    <div className="feed-container">
      {displayResults(shuffle(combinedFeed))}
    </div>
  );
};

export default HomeFeed;
