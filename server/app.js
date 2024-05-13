import express from 'express';
import { Server } from 'socket.io';
import { createServer } from "http"
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const secretKey = "secret"
const port = 3000;
const app = express();

const server = createServer(app);


const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }

});



app.get('/', (req, res) => {
    res.send('Hello World');
})


app.get('/login', (req, res) => {
  const token = jwt.sign({_id:"kfwkmwfkm"},secretKey)

  res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"none"})
  .json({
        message:"User logged in"
  })

})

const user = false;

io.use((socket,next) => {
    cookieParser()(socket.request,socket.request.res,(err) => {
        if(err) return next(err)
            const token = socket.request.cookies.token;
          if(!token) return next(new Error("Authentication error"))

           const decoded = jwt.verify(token,secretKey)
           next()
    })
})

io.on('connection', (socket) => {

    console.log('a user connected',socket.id);

    socket.on("message",({room,message})=>{
        console.log(message )
        // io.emit("recieve-message",message)
        // socket.broadcast.emit("recieve-message",message)
        io.to(room).emit("recieve-message",message) 
    })
    socket.on("join-room",(roomName)=>{
        socket.join(roomName)
        console.log(`User joined room ${roomName}`)
    })
    // socket.emit("welcome", `Welcome to the server,${socket.id}`)
    // socket.broadcast.emit("welcome", `User ${socket.id} has connected`)
     socket.on("disconnect",(s)=>{ 
         console.log("User disconnected",s)
     })
}
)

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})