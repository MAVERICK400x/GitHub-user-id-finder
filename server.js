const express=require("express");
const server=express();

server.get("/",(req,res)=>
{
    return res.send("Getting started");
})
server.use(express.static('public'))
server.listen(3000);
console.log("http://localhost:3000/index.html");