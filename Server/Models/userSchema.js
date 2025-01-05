const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user",
    },
    firstName: {
        type: String,
        required: [true, 'Name is required!']
    },
    lastName: {
        type: String,
        required: [true, 'Name is required!']
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    phone: {
        type: Number,
        required: [true, 'Phone is required!']
    },
    address: {
        type: String
    },
    // הוספת סכמה מקוננת לפרטי ההשכרה
    rentalDetails: {
        carNumber: {
            type: String,
            // required: true
        },
        totalDays: {
            type: Number,
            // required: true
        },
        totalPrice: {
            type: Number,
            // required: true
        },
        startDate: {
            type: String,  // שיניתי ל-String כי זה מגיע כ-ISO string
            // required: true
        },
        endDate: {
            type: String,  // שיניתי ל-String כי זה מגיע כ-ISO string
            // required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('userSchemas', userSchema)