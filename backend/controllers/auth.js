import bcryptjs from "bcryptjs";
import { User } from "../models/user.js";
import createSecretToken from "../utils/createToken.js";
import emailValidator from "email-validator";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username && !password && !email) {
      return res.status(400).json({ message: "Provide all required fields." });
    } else {
      if (!emailValidator.validate(email)) {
        return res.status(400).json({ message: "Invalid email address." });
      } else {
        const salt = await bcryptjs.genSalt();
        const passwordHash = await bcryptjs.hash(password, salt);
        const newUser = new User({
          username,
          email,
          password: passwordHash,
        });
        const savedUser = await newUser.save();
        const token = createSecretToken(savedUser._id);
        res
          .status(201)
          .json({
            token,
            user: { username: savedUser.username, email: savedUser.email },
          });
      }
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("A request from ", email);
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = createSecretToken(user._id);
    delete user.password;
    res
      .status(200)
      .json({ token, user: { username: user.username, email: user.email } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};
