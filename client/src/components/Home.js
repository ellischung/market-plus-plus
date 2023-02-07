import React from "react";
import Navbar from "./Navbar";
import Filters from "./Filters";
import Feed from "./Feed";
import "./Home.css"

const Home = () => {
  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <Filters />
        <Feed />
      </div>
    </div>
  );
};

export default Home;
