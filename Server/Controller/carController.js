const jwt = require("jsonwebtoken")
const carSchema = require("../Models/carsSchema");


const verifyToken = (req) => {
  try {
    
    if (!req.cookies || !req.cookies.token) {
      throw new Error('No token found');
    }
    const token = req.cookies.token;
    const tokenData = token.split(" ")[1]
    
    const decoded = jwt.verify(tokenData, process.env.SECRET_KEY);
    return decoded.id;
    
  } catch (error) {
    console.error(error);
    
  }

}

exports.addCar = async (req, res) => {
  try {

    const userId = verifyToken(req)
    if(!userId){
      return res.status(401).json({message: 'Unauthorized'})
    }

    const {
      picture,
      typeCar,
      model,
      color,
      carNumber,
      kilometer,
      dateTest,
      dateMOT,
    } = req.body;

    // בדיקת שדות ריקים
    if (
      !picture ||
      !typeCar ||
      !model ||
      !color ||
      !carNumber ||
      !kilometer ||
      !dateTest ||
      !dateMOT
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // בדיקת אם רכב כבר קיים
    const findCar = await carSchema.findOne({ carNumber: carNumber });

    if (findCar) {
      return res.status(409).json({ message: "Car already exists" });
    }

    // יצירת רכב חדש ושמירה
    const newCar = new carSchema({ ...req.body , user: userId});
    await newCar.save();

    res.status(201).json({ message: "Car added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.getCars = async (req, res) => {
  try {

    const userId = verifyToken(req); // קבלת מזהה המשתמש מה-token
    console.log('User ID:', userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" }); // אם אין token או הוא לא תקין
    }

    const cars = await carSchema.find({ user: userId }).populate({
      path: 'user',
      select: '-password',
    });

    res.status(200).json(cars);
  } catch (error) {
    console.error('Error in getCars:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateCar = async (req, res) => {
  try {
    const carNumber = req.params.carNumber;

    // עדכון רכב לפי מספר רכב
    const updatedCar = await carSchema.findOneAndUpdate(
      { carNumber: carNumber },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(updatedCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const carNumber = req.params.carNumber;

    // מחיקת רכב לפי מספר רכב
    const deletedCar = await carSchema.findOneAndDelete({ carNumber });

    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({
      status: "deleted",
      deletedCar,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
