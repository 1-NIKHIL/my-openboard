const express=require("express"); //Access
const socket=require("socket.io");

const app=express(); //Initailize and server ready

app.use(express.static("public"));

 let port=3005;
// app.use(express.static("public"));

let server=app.listen(port,() =>{
  console.log("Listening to port"+port);
})
//
let io=socket(server);
//
io.on("connection", (socket) =>{
    console.log("Made socket connection");

    //Received Data
    socket.on("beginPath",(data)=>{
      //data -> data from frontend
      //Now tramsfer data to all connect computers
      io.sockets.emit("beginPath",data);
    })

    socket.on("drawStroke",(data)=>{
      io.sockets.emit("drawStroke",data);
    })

    socket.on("redoUndo",(data)=>{
      io.sockets.emit("redoUndo",data);
    })
})
//
