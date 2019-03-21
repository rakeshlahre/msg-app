
module.exports = (db) => {
  const createUser = async (username, password, profile, email) => {
    const result = await db.one(
      "INSERT INTO users (username, password, picture, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [ username, password, profile, email ]
    );

    return result;
  };

    // Case-insensitive
  const getUserByName = async (username) => {
    const user = await db.oneOrNone(
      "SELECT * FROM users WHERE lower(username) = lower($1)",
      username
    );

    return user;
  };

  const getUserByGoogleId = async (googleUserId) => {
    const result = await db.oneOrNone(
      "SELECT * FROM users WHERE google_user_id = $1",
      googleUserId
    );

    return result;
  };

  const getUserByFacebookId = async (facebookUserId) => {
    const result = await db.oneOrNone(
      "SELECT * FROM users WHERE facebook_user_id = $1",
      facebookUserId
    );

    return result;
  };

  const getUserbyUsername = async (userName) => {
    const result = await db.oneOrNone(
      "SELECT * FROM users WHERE username = $1",
      userName
    );

    return result;
  };

  const checkUserNameExists = async (username) => {
    const result = await db.oneOrNone(
      "SELECT username from users WHERE username = $1",
      username
    );

    return !!result;
  };

  const createGoogleUser = async (
    userName,
    email,
    picture,
    googleUserId
  ) => {
    const result = await db.one(
      `
      INSERT INTO users
      (username, email, google_user_id, picture)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [ userName, email, googleUserId, picture]
    );

    return result;
  };

  const createFacebookUser = async (
    username,
    email,
    faceboookUserId,
    picture
  ) => {
    const result = await db.one(
      `
      INSERT INTO users (username, email, facebook_user_id, picture)
        VALUES ($1, $2, $3, $4)
      RETURNING
        *
      `,
      [username, email, faceboookUserId, picture]
    );

    return result;
  };

  const saveJwtUserToken = async (userId, username, token) => {
    await db.none(
      `
      INSERT INTO user_tokens (user_id, username, token) 
      VALUES 
        ($1, $2, $3)
      `,
      [ userId, username, token ]
    );
  };

  const getUserToken = async (userId) => {
    const result = await db.oneOrNone(
      `
      SELECT 
        * 
      FROM 
        user_tokens 
      WHERE 
        user_id = $1
      `,
      userId
    );

    return result;
  };

  const getUserByToken = async (token) => {
    const result = await db.oneOrNone(
      `
      select 
      u.id, 
      u.username, 
      u.email, 
      u.google_user_id, 
      u.facebook_user_id, 
      u.picture 
      from 
        users u 
        INNER JOIN user_tokens ut on u.id = ut.user_id 
      WHERE 
        ut.token = $1
      `,
      token
    );

    return result;
  };

  const deleteUserToken = async (userId, token) => {
    await db.none("DELETE FROM user_tokens WHERE user_id = $1 AND token = $2", [
      userId,
      token
    ]);
  };

  const getAllUsers = async () => {
    const result = await db.any("SELECT id, username, picture FROM users");

    return result;
  };

  const getUserMessages = async (userId) => {
    const result = await db.any("SELECT * FROM private_chats WHERE to_user_id = $1 OR from_user_id = $1", userId);

    return result;
  };

  const updatePrivateChat = async (fromUserId, toUserId, fromUserName, toUserName, message) => {
     await db.none(`
      INSERT INTO private_chats 
        (from_user_id, to_user_id, from_username, to_username, message)
      VALUES ($1, $2, $3, $4, $5)
      `, [fromUserId, toUserId, fromUserName, toUserName, message]);
  }

  return {
    getUserByName,
    createUser,
    getUserByGoogleId,
    createGoogleUser,
    saveJwtUserToken,
    getUserToken,
    getUserByFacebookId,
    createFacebookUser,
    checkUserNameExists,
    getUserbyUsername,
    deleteUserToken,
    getUserByToken,
    getAllUsers,
    getUserMessages,
    updatePrivateChat
  };
};
