const User = require("../Models/userSchema");
const {mailSender} = require("../mailSender");

exports.capturePayment = async (req, res) => {
    try {
        console.log(req.params.user_id);
        const {amount} = req.body;
        const user = await User.findById(req.params.user_id);
        console.log(user);
        if(!user) return res.status(404).json({message: "User not found"});
        mailSender(user.email, "Payment captured successfully", `Your payment of ${amount} has been captured successfully`);
        res.status(200).json({message: "Payment captured successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}
