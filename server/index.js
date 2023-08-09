import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

// import userRoutes from './routes/users.js'
import { signin, signup, updateFavorite } from "./controllers/user.js";
import {
  craigslistSearch,
  ebaySearch,
  facebookSearch,
  offerupSearch,
  etsySearch,
  craigslistHomeFeed,
  ebayHomeFeed,
  facebookHomeFeed,
  offerupHomeFeed,
  etsyHomeFeed,
} from "./controllers/search.js";

const app = express();

//setting up parser to properly send requests
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.post("/user/signin", signin);
app.post("/user/signup", signup);
app.patch("/user/updateFavorite", updateFavorite);
app.get("/search/craigslistSearch", craigslistSearch);
app.get("/search/ebaySearch", ebaySearch);
app.get("/search/facebookSearch", facebookSearch);
app.get("/search/offerupSearch", offerupSearch);
app.get("/search/etsySearch", etsySearch);
app.get("/search/craigslistHomeFeed", craigslistHomeFeed);
app.get("/search/ebayHomeFeed", ebayHomeFeed)
app.get("/search/facebookHomeFeed", facebookHomeFeed);
app.get("/search/offerupHomeFeed", offerupHomeFeed);
app.get("/search/etsyHomeFeed", etsyHomeFeed);

app.get("/", (req, res) => {
  res.send("APP IS RUNNING.");
});

const CONNECTION_URL =
  "mongodb+srv://marketplusplus:markettest@cluster0.8nzquvu.mongodb.net/?retryWrites=true&w=majority";
const PORT = 5000;

mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
