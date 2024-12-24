// const verifyToken = (req) => {
//   if (!req.cookies || !req.cookies.token) {
//     throw new Error('No token found');
//   }
//   const token = req.cookies.token;
//   const decoded = jwt.verify(token, process.env.SECRET_KEY);
//   return decoded.userId;
// }


// exports.getCars = async (req, res) => {
//   try {
//     const userId = verifyToken(req);
//     const cars = await carSchema.find({ user: userId })
//     .populate({path:'user', select:'- password'});
//     if (cars.length === 0) {
//       return res.status(404).json({ message: "No cars found" });
//     }
//     res.status(200).json(cars);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
