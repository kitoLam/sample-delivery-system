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
    token: "1",
    userType: "SHOP",
  },
});
socket.connect();
// client-side
socket.on("connect", () => {
  console.log(socket.id);
});
socket.on("CUSTOMER_ONLINE", (data) => {
  const dataObj = JSON.parse(data);
  console.log("Customer online: ", dataObj.id);
});
socket.on("RECEIVE_MESSAGE", (data) => {
  const dataFinal = JSON.parse(data);
  console.log(dataFinal.createdAt + "::" + dataFinal.userType + " send a message: ", dataFinal.content);
});
socket.on("connect_error", (err) => {
  console.log(err.data);
});
rl.on("line", (line) => {
  if (line == "0.1") {
    socket.emit(
      "JOIN_ROOM",
      {
        roomChatId: "1",
      },
      (response) => {
        console.log(response);
      },
    );
  } else if (line == "1") {
    socket.emit(
      "SEND_A_MESSAGE",
      JSON.stringify({
        roomChatId: "1",
        content: "staff 1 hi",
      }),
      (response) => {
        console.log(response);
      },
    );
  } else if (line == "2.1") {
    socket.emit("JOIN_ROOM", JSON.stringify({ roomChatId: "1" }));
  } else if(line == "2.2"){
    socket.emit("LEAVE_ROOM", JSON.stringify({ roomChatId: "1" }))
  }
});
