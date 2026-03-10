const { io } = require("socket.io-client");
const readline = require("readline");
const { stdin: input, stdout: output } = require("process");
const moment = require("moment");
const rl = readline.createInterface({
  input,
  output,
});
const socket = io("http://localhost:5000", {
  autoConnect: false,
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTc4NWI3OGNiMDJiNmVmMmY5MjI1NzMiLCJyb2xlIjoiT1BFUkFUSU9OX1NUQUZGIiwidHlwZSI6IkFDQ0VTUyIsImlhdCI6MTc3Mjk4Mzk0NiwiZXhwIjoxNzcyOTg0NTQ2fQ.rD6ADHWxxEduyWKIdBb3HFMZ89W0-F97mCUOfttDfeo",
    userType: "STAFF",
  },
});
socket.connect();
// client-side
socket.on("connect", () => {
  console.log(socket.id);
});
socket.on("RECEIVE_INVOICE_CREATE", (data) => {
  console.log("Data of event RECEIVE_INVOICE_CREATE::", data);
});
socket.on("RECEIVE_ASSIGN_ORDER", (data) => {
  console.log("Data of event RECEIVE_ASSIGN_ORDER::", data);
});
socket.on("RECEIVE_ASSIGN_INVOICE", (data) => {
  console.log("Data of event RECEIVE_ASSIGN_INVOICE::", data);
});
socket.on("connect_error", (err) => {
  console.log(err.data);
});