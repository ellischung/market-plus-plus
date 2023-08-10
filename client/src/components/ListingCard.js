import React, { useState } from "react";
import { Card, CardMedia } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const ListingCard = ({ listing, user }) => {
    // create unique id for listing
    const id = `${listing.url}$-filler-$${listing.title}$-filler-$${listing.imageUrl}$-filler-$${listing.price}$-filler-$${listing.platform}`;
    const [isFavorite, setIsFavorite] = useState(
      user.result.liked_listings.includes(id)
    );

    const handleIconClick = (e) => {
      e.stopPropagation(); // to prevent the card click event from firing
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);

      // call the API to add/remove from favorites
      try {
        API.patch("/user/updateFavorite", {
          userId: user.result._id,
          listingHash: id,
          isFavorite: newFavoriteStatus,
        });
        // copy current user data
        let updatedUser = JSON.parse(JSON.stringify(user));

        if (newFavoriteStatus) {
          // if the listing was added to favorites, add it to the liked_listings array
          updatedUser.result.liked_listings.push(id);
        } else {
          // if the listing was removed from favorites, remove it from the liked_listings array
          updatedUser.result.liked_listings =
            updatedUser.result.liked_listings.filter(
              (listingId) => listingId !== id
            );
        }

        // update the user state with the updated user data
        setUser(updatedUser);
        // update the user data in local storage
        localStorage.setItem("profile", JSON.stringify(updatedUser));
      } catch (err) {
        console.error(err);
        setIsFavorite(!newFavoriteStatus); // revert the favorite state if the API call fails
      }
    };

    return (
      <Card
        className="itemContainer"
        onClick={() => window.open(listing.url, "_blank")}
      >
        <CardMedia
          component="img"
          alt="img"
          image={
            listing.imageUrl ? listing.imageUrl : require("../images/temp.jpg")
          }
          sx={{ height: "15em", width: "15em" }}
        />
        <div className="cardTitle">{listing.title}</div>
        <br />
        <div className="cardPrice">
          {listing.price ? listing.price : "No price listed"}
        </div>
        <div className="cardMeta">{listing.location}</div>
        <div className="cardMeta">{listing.platform}</div>
        <div onClick={handleIconClick}>
          {isFavorite ? (
            <FavoriteIcon sx={{ color: "#6cbad2" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "#6cbad2" }} />
          )}
        </div>
      </Card>
    );
  };


export default ListingCard;