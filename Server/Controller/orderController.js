const Order = require('../Models/ordersSchema');

// יצירת הזמנה חדשה
const createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = new Order(orderData);
        await newOrder.save();
        res.status(201).json({ 
            success: true, 
            message: 'ההזמנה נוצרה בהצלחה',
            order: newOrder 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: 'שגיאה ביצירת ההזמנה', 
            error: error.message 
        });
    }
};

// קבלת כל ההזמנות
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email phone')
            .populate('carId', 'brand model year');
        res.status(200).json({ 
            success: true, 
            orders 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'שגיאה בקבלת ההזמנות', 
            error: error.message 
        });
    }
};

// קבלת הזמנות של משתמש ספציפי
const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ userId })
            .populate('carId', 'brand model year');
        res.status(200).json({ 
            success: true, 
            orders 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'שגיאה בקבלת ההזמנות', 
            error: error.message 
        });
    }
};

// קבלת הזמנה ספציפית לפי ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('userId', 'name email phone')
            .populate('carId', 'brand model year');
        
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'ההזמנה לא נמצאה' 
            });
        }

        res.status(200).json({ 
            success: true, 
            order 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'שגיאה בקבלת ההזמנה', 
            error: error.message 
        });
    }
};

// עדכון סטטוס הזמנה
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: 'ההזמנה לא נמצאה' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'סטטוס ההזמנה עודכן בהצלחה',
            order: updatedOrder 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'שגיאה בעדכון סטטוס ההזמנה', 
            error: error.message 
        });
    }
};

// עדכון סטטוס תשלום
const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentStatus } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { paymentStatus },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: 'ההזמנה לא נמצאה' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'סטטוס התשלום עודכן בהצלחה',
            order: updatedOrder 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'שגיאה בעדכון סטטוס התשלום', 
            error: error.message 
        });
    }
};

// מחיקת הזמנה
const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
        
        if (!deletedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: 'ההזמנה לא נמצאה' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'ההזמנה נמחקה בהצלחה' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'שגיאה במחיקת ההזמנה', 
            error: error.message 
        });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder
};
