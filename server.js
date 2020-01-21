const express = require('express')
//var serv = require("socket.io");
const app = express()
var PORT = process.env.PORT || 80;
//var io = serv.listen(80);  // เปิดเซิฟเวอร์ที่ port 9999
var server = app.listen(PORT, () =>{
    console.log('Start server at port '+PORT)
})

app.get('/',(req,res) =>{
    res.send('Hello World2')
})

app.get('/saifa',(req,res) => {
    res.send('Hello Saifa')
})

app.get('/dev',(req,res) => {
    res.send('Hello dev')
})