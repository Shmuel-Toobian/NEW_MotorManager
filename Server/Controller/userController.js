const userSchema = require("../Models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.SECRET_KEY;

exports.getUser = async (req, res) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token.split(" ")[1], secretKey); // Assumes token is in "Bearer <token>" format

    // Fetch user details from the database
    const user = await userSchema.findById(decoded.id).select("-password"); // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve user", error: error.message });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const findUser = await userSchema.findOne({ email: email });

    if (!name || !password || !email) {
      return res
        .status(409)
        .json({ message: "Name and password and email is requierd" });
    }

    if (findUser) {
      const chekPassword = await bcrypt.compare(password, findUser.password);
      if (!chekPassword) {
        return res
          .status(404)
          .json({ message: "User already exists with this email go Login" });
      }

      const token = jwt.sign({ id: findUser._id }, secretKey, {
        expiresIn: "30d",
      });
      res.cookie("token", "Bearer " + token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      return res.status(409).json({ message: "User already exists go Login" });
    }
    const newUser = new userSchema({ ...req.body, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: "User created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await userSchema.findOne({ email: email });

    if (!password || !email) {
      return res
        .status(409)
        .json({ message: "Password and email is requierd" });
    }
    if (!findUser) {
      return res.status(404).json({ message: "Email or password invalid" });
    }
    const chekPassword = await bcrypt.compare(password, findUser.password);

    if (!chekPassword) {
      return res.status(404).json({ message: "Email or password invalid" });
    }

    const token = jwt.sign({ id: findUser._id }, secretKey, {
      expiresIn: "30d",
    });
    res.cookie("token", "Bearer " + token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    const user = findUser.toObject(); // ממיר את המסמך לאובייקט רגיל
    delete user.password; // מסיר את השדה password
    res.status(201).json({ message: "welcome " + findUser.name, user });
    
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

exports.deleteCookie = async(req, res)=>{

  try {
    res.clearCookie('token', { 
      httpOnly: true,
      secure: true,
      path:'/'
      
    })
    res.json({message: 'cookie deleted'})
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }

}
