const socketIo = require( "socket.io" ),
  cookieParser = require( "cookie-parser" ),
  { attachCurrentUserToSocketRequest } = require( "../middleware" ),
  uuid = require( "uuid" );

startSocketServer = function( server, db) {
  const io = socketIo.listen( server, { "cookie": false } );

  io.use(function (socket, next) {
    cookieParser()(socket.request, null, next);
  });

  io.use(function (socket, next) {
    attachCurrentUserToSocketRequest(socket, socket.request, null, next);
  });

  io.use(function (socket, next) {
    socket.request.id = uuid.v4();
    next();
  });

  io.on('connection', async function (socket) {
    console.log('connected to socket');
    const currentUser = socket.request.currentUser;
    const currentUsername = currentUser && currentUser.username;

    let messsages = [];
    if (currentUser) {
      socket.join(currentUsername);
      socket.join(currentUser.id);

      messsages = await db.users.getUserMessages(currentUser.id);
    }

    const transformMessages = messsages.map(x => {return {fromUserId : x.from_user_id, toUserId: x.to_user_id, fromUserName: x.from_username, toUserName: x.to_username, message: x.message}});


    socket.once('join', async function () {
      const allUsers = await db.users.getAllUsers();

      if (currentUser) {
        const index = allUsers.findIndex(x => x.id === currentUser.id);
        if (index > -1) {
          allUsers.splice(index, 1);
        }
        
        socket.emit("ALL_USERS", allUsers);
      }

      socket.emit("ALL_MESSAGES", transformMessages);
    });

    socket.on('message', async function (data) {
      socket.to(data.toUserId).emit(`message`, data);

      await db.users.updatePrivateChat(data.fromUserId, data.toUserId, data.fromUserName, data.toUserName, data.message);
    });

    socket.on('disconnect', function () {
    });

    socket.on('error', function (e) {
      console.log('CAUGHT', e);
    });
  });
};

module.exports = startSocketServer;

