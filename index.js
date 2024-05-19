const port = process.env.PORT || 8080;
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const categoryRouter = require('./routes/category')

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(require('cors')()); 

app.use('/category', categoryRouter)

io.on('connection', (socket) => {
  socket.on("request order", (order)=>{
    io.emit("recieved order request", order);
  })
});

server.listen(port, () => {
  console.log(`server running at ${port}`);
});
