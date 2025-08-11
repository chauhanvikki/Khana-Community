 import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.log(`Error in signup: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// async function login(req, res) {
//   try {
//     localStorage.setItem("donorName", decoded.name);

//     const { email, password } = req.body;

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User does not exist" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Password is invalid" });
//     }

//     const token = jwt.sign(
//       { email: user.email,  name: user.name ,id: user._id },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "24h" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       donorName: user.name ,
//       donorId: user._id, // Include donorId in response
//     });
//   } catch (err) {
//     console.log(`Error in login: ${err.message}`);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// export  {signup, login};

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password is invalid" });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      donorName: user.name,
      donorId: user._id,
    });
  } catch (err) {
    console.log(`Error in login: ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export  {signup, login};