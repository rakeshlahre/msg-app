const config = require("config");
const db = require("./db");

const attachCurrentUserToRequest = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    next();
    return;
  }

  const dbUser = await db.users.getUserByToken(token);

  if (!dbUser) {
    next();
    return;
  }

  let user = {
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    google_user_id: dbUser.google_user_id, // eslint-disable-line camelcase
    facebook_user_id: dbUser.facebook_user_id, // eslint-disable-line camelcase
    picture: dbUser.picture
  };
  
  req.currentUser = user;

  next();
};

// TODO - review the comments
const requireLoggedIn = async (req, res, next) => {
  if (!req.currentUser) {
    // this should maybe return login url?
    res.status(401).send("Unauthorized");
    return; // should this be here? do we need   res.end();?
  }

  next();
};

const checkTokenExists = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({ auth: false, message: "No token provided" });
  }

  next();
};

const attachCurrentUserToSocketRequest = async (socket, req, res, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    next();

    return;
  }

  const dbUser = await db.users.getUserByToken(token);

  if (!dbUser) {
    next();
    return;
  }

  let user = {
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    google_user_id: dbUser.google_user_id, // eslint-disable-line camelcase
    facebook_user_id: dbUser.facebook_user_id, // eslint-disable-line camelcase
    picture: dbUser.picture
  };
  
  req.currentUser = user;

  next();
};

module.exports = {
  attachCurrentUserToRequest,
  requireLoggedIn,
  checkTokenExists,
  attachCurrentUserToSocketRequest
};
