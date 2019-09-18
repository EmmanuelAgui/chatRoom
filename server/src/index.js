var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var users = [];

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/index.html')
  console.log('server running')
});

io.on("connection", function (socket) {
  console.log("a user connected");

  socket.on("CLIENT_USER", function (user) {
    console.log(user);
    // 加入用户数组
    users.push(user);
    io.emit("NEW_USER", user);
  })

  socket.on("OUTGOING_MSG", function (msg) {
    io.emit("INCOMING_MSG", msg);
    console.log(msg);
  });

  socket.on("RECALL_MSG", function (message) {
    io.emit("RECALL_MSG", message);
  })

  socket.on("USER_LEAVING", function (user) {
    // 将用户从数组移除
    if (user) {
      users = users.filter(function (item) { return item.id !== user.id });
      io.emit("USER_LEFT", user)
    }
  })

  socket.on("disconnect", function () {
    console.log("user disconnected");
    io.emit("")
  });
});

http.listen(8383, function () {
  console.log("listening on *:8383");
});
