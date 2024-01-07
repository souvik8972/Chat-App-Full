const express = require('express')
const app = express();
const cors = require('cors');
const path = require("path");
const bodyParser = require('body-parser')
const sequelize = require("./util/db")
require("dotenv").config()
const PORT = process.env.PORT
const User = require("./models/userDb")
const chatHistory = require("./models/ChatHistory")

const Group = require("./models/groupDb")
const GroupMember = require("./models/group-members")


////routes
const userRoute = require("./routes/user")
const messageRoute = require("./routes/AllFunction")
const groupRoute=require("./routes/groupRoute")






app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors());


//
app.use(userRoute)
app.use(messageRoute)
app.use(groupRoute)

//association

User.hasMany(chatHistory)
chatHistory.belongsTo(User,
    { constraints: true, onDelete: 'CASCADE' }

)
User.belongsToMany(Group,{through:GroupMember})
Group.belongsToMany(User,{through:GroupMember})
Group.belongsTo(User,{foreignKey:"AdminId"})

sequelize.sync({}).then(() => {
    app.listen(PORT, () => {
        console.log(`listen on port http://localhost:${PORT}`)
        console.log('Database and tables synchronized!');

    })

}).catch(err => console.error(err))