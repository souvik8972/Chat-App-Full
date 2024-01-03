const express=require('express')
const app = express();
const cors= require('cors');
const path=require("path");
const bodyParser = require('body-parser')
const sequelize=require("./util/db")
require("dotenv").config()
const PORT=process.env.PORT 




const userRoute=require("./routes/user")




app.get("/",(req,res)=>{
    res.sendFile("index.html",{root:"views"})
})




app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors({
    origin: `http://localhost:${PORT}`
}));


//
app.use(userRoute)




sequelize.sync().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`listen on port http://localhost:${PORT}`)
        console.log('Database and tables synchronized!');
        
    })

}).catch(err=>console.error(err))