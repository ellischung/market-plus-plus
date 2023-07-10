import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) return res.status(404).json("User doesn't exist");

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) return res.status(400).json("Invalid credentials.");

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Error signin 500." });
  }
};

export const signup = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json("User already exists");

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      given_name: name,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });

    res.status(200).json({ result: result, token });
  } catch (error) {
    res.status(500).json({ message: "Error signup 500." });
  }
};

// export const updateFavorite = async (req, res) => {
//   const { userId, listingHash } = req.body;
//   console.log(userId, listingHash)

//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.userId, { liked_listing: [...req.listingHash]})
    
//     const token = req.headers.authorization.split(" ")[1];

//     res.status(200).json({ result: updatedUser, token });
//   } catch (error) {
//     res.status(500).json({ message: 'Error update user 500.' })
//   }
// }

export const updateFavorite = async (req, res) => {
  const { userId, listingHash, isFavorite } = req.body;
  console.log(userId, listingHash, isFavorite)

  try {
    // find the user and update their liked_listing, this might be different based on your User schema
    const user = await User.findById(userId);
    console.log(user);
    if (isFavorite) {
      if (!user.liked_listings.includes(listingHash)) {
        user.liked_listings.push(listingHash);
      }
    } else {
      user.liked_listings = user.liked_listings.filter(hash => hash !== listingHash);
    }
    
    await user.save();
    
    const updatedUser = await User.findById(userId);

    res.status(200).json({ result: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user.' })
  }
}
