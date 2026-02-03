const express = require('express');
// Không cần config dotenv ở đây nếu bạn đã nhập biến môi trường trên Vercel Dashboard
require('dotenv').config(); 
const { connectDb } = require('../config/db.config'); // Lưu ý đường dẫn nếu bạn cho vào thư mục api/
const controller = require('../controllers/index.controller');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối DB ngay lập tức (Vercel sẽ giữ lại kết nối này giữa các request nếu có thể)
connectDb();

app.get('/', (req, res) => { res.json('ok') });
app.post('/create-shipment', controller.createShip);
app.post('/mark-receive/:id', controller.markReceive);
app.post('/mark-complete/:id', controller.markComplete);


// QUAN TRỌNG 2: Xuất app để Vercel handler nhận diện
module.exports = app;