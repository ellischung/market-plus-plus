import React from "react";
import Navbar from "./Navbar";
import Feed from "./Feed";
import "./Home.css"

const Home = () => {
  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <div className="filterField">Filters</div>
        <Feed />
      </div>
    </div>
  );
};

export default Home;
