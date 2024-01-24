const express = require('express')
const app = express();
const cors = require('cors');
const path = require("path");
const bodyParser = require('body-parser')
const sequelize = require("./util/db")
require("dotenv").config()
const PORT = process.env.PORT
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const socketService = require("./services/websocket")
const cronJob=require("./services/cron")






const User = require("./models/UserDb")
const Chat = require("./models/ChatHistory")

const Group = require("./models/GroupDb")
const GroupMember = require("./models/GroupMember")




//socket
io.on('connection', socketService);


////routes
const userRoute = require("./routes/user")
const messageRoute = require("./routes/messageRoute")
const groupRoute=require("./routes/groupRoute")






app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors());

//
app.use(userRoute)
app.use("/group",messageRoute)
app.use(groupRoute)

//association

User.hasMany(Chat)
Chat.belongsTo(User,
    { constraints: true, onDelete: 'CASCADE' }

)
User.belongsToMany(Group,{through:GroupMember})
Group.belongsToMany(User,{through:GroupMember})
Group.belongsTo(User,{foreignKey:"adminId"})
Group.hasMany(Chat);
Chat.belongsTo(Group);

// cronJob.job.start()
sequelize.sync().then(() => {
    server.listen(PORT, () => {
        console.log(`listen on port http://localhost:${PORT}`)
        console.log('Database and tables synchronized!');

    })

}).catch(err => console.error(err))