const express=require('express')
const app = express();
const cors= require('cors');
const path=require("path");
const bodyParser = require('body-parser')


require("dotenv").config()
const PORT=process.env.PORT || 8080

app.get("/",(req,res)=>{
    res.sendFile("index.html",{root:"views"})
})



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors());

app.listen(PORT,()=>{
    console.log(`listening in http://localhost:${PORT}`)
})