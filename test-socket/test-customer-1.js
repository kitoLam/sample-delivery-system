const {io} = require('socket.io-client');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const moment = require('moment');
const rl = readline.createInterface({
  input,
  output
});
const socket = io("http://localhost:5000", {
  auth: {
    token: "1",
    userType: "CUSTOMER"
  }
});
socket.connect();
// client-side
socket.on("connect", () => {
  console.log(socket.id);
});
socket.on("RECEIVE_MESSAGE", (data) => {
  const dataFinal = JSON.parse(data);
  console.log(dataFinal.createdAt + "::" + dataFinal.userType + " send a message: ", dataFinal.content);
});
rl.on("line", (line) => {
  // socket.emit("message", line);
  // console.log(`I type in ${moment(new Date()).format("HH:mm:ss DD/MM/YYYY")}: type something`);

  if(line == "1"){
    socket.emit('SEND_MESSAGE', JSON.stringify({
      roomChatId: "1",
      content: "cust 1 hello"
    }), (response) => {
      console.log(response);
    })
  }
  else if(line == "2"){

  }
});