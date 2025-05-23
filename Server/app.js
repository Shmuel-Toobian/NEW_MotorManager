const indexRoutes = require("./Routes/indexRoutes")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config();

const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json())

const corsOptions = {
    origin: "http://localhost:5173",  // כתובת הלקוח שלך
    credentials: true,                // מאפשר שליחה וקבלה של Cookies
};
app.use(cookieParser());  // וודא שאתה מחבר את cookie-parser לפני שהשרת מתחיל לקבל בקשות
app.use(cors(corsOptions));
app.use(indexRoutes)

const port = process.env.PORT || 3000;
const url = process.env.URL;



const conect_db = async () => {
    try {
        await mongoose.connect(url)
        console.log("connected to mongodb");
    } catch (error) {
        console.log(error);
    }
}
conect_db();

app.listen(port, () => {
    console.log(`runing on port http://localhost${port}`)
});

