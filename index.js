const express = require('express');
require('dotenv').config();
const { connectDb } = require('./config/db.config');
const controller = require('./controllers/index.controller');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/create-shipment', controller.createShip);
app.post('/mark-receive/:id', controller.markReceive);
app.post('/mark-complete/:id', controller.markComplete);
app.listen(3000, () => {
  connectDb()
  console.log('Server is running on port 3000');
});