const cookieParser = require('cookie-parser');
const express = require('express');
const connectToCloudinary = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
const { connect } = require('./config/connectToDB');
const cors = require("cors");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
 
app.listen(PORT, () => console.log("App Started ON  ", PORT));

app.use(express.json());
app.use(cookieParser()); // <-- Add parentheses here
// file parser
app.use(fileUpload({
    useTempFiles : true,
    // This Tmp means On Your Local machine file be stored at that directory and will automatically Get Deleted
    tempFileDir : '/tmp/',
}));
app.use(
    cors(
        {
            origin:"*",
            credentials:true,
        }
    )
)
connect();

const router = require('./router/route');

app.get('/', (req, res) => { res.send("App Started !!",PORT); });
app.use(router);
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your Server Is Started"
    })
})

connectToCloudinary();

