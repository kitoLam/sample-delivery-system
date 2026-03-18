const express = require("express");
// Không cần config dotenv ở đây nếu bạn đã nhập biến môi trường trên Vercel Dashboard
<<<<<<< HEAD
require('dotenv').config(); 
const cors = require('cors');
const { connectDb } = require('../config/db.config'); // Lưu ý đường dẫn nếu bạn cho vào thư mục api/
const controller = require('../controllers/index.controller');
=======
require("dotenv").config();
const { connectDb } = require("../config/db.config"); // Lưu ý đường dẫn nếu bạn cho vào thư mục api/
const controller = require("../controllers/index.controller");
>>>>>>> 9a007085b7d8edfc14076b4b4017366f8ffcc315

const app = express();
// CORS configuration - accept all domains
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối DB ngay lập tức (Vercel sẽ giữ lại kết nối này giữa các request nếu có thể)
connectDb();

app.get("/", (req, res) => {
  res.json("ok");
});
app.post("/create-shipment", controller.createShip);
app.post("/mark-receive/:id", controller.markReceive);
app.post("/mark-complete/:id", controller.markComplete);
app.post("/mark-fail/:id", controller.markFail);
app.get("/ships", controller.getAllShips);

// QUAN TRỌNG 2: Xuất app để Vercel handler nhận diện
module.exports = app;
