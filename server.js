const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const Swal = require('sweetalert2');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("index.hbs");
})

const users = {}

io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado");
    socket.on("newUser", (username) => {
        users[socket.id] = username;
        io.emit("userConnected", username)
    })


    socket.on("chatMessage", (message) => {
        const username = users[socket.id];
        io.emit("message", { username, message })
    })

    socket.on("disconnect", () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit("userDisconnected", username)
    })
})

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})