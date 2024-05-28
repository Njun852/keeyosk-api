const port = process.env.PORT || 8080;
const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const categoryRouter = require("./routes/category");
const productOptionRouter = require("./routes/productOption");
const productRouter = require("./routes/product");
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/order')

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(require("cors")());

app.use("/category", categoryRouter);
app.use("/product_option", productOptionRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter)
app.use('/order', orderRouter)

io.on("connection", (socket) => {
  socket.on("request order", (order) => {
    io.emit("recieved order request", order);
  });
});

server.listen(port, () => {
  console.log(`server running at ${port}`);
});
