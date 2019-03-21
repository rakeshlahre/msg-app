const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const config = require("config");
const db = require("../db");
const jwt = require("jsonwebtoken");
const requestPromise = require("request-promise");
const mw = require("../middleware");


const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(config.get("GOOGLE_CLIENT_ID"));

module.exports = () => {
  router.post("/logout", mw.requireLoggedIn, async (req, res) => {
    await db.users.deleteUserToken(
      req.currentUser.id,
      req.headers.authorization
    );
    res.end();
  });

  router.post('/google-sign-in', async (req, res, next) => {

    const ticket = await client.verifyIdToken({
      idToken: req.body.idtoken,
      audience: config.get('GOOGLE_CLIENT_ID')
    });
    const payload = ticket.getPayload();

    const googleUserId = payload.sub;

    const user = await db.users.getUserByGoogleId(googleUserId);

    if (!user) {
      return res.status(401).json({error: 'Login failed'});
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      googleUserId: user.google_user_id,
    });
  });

  router.post("/google-sign-up", async (req, res) => {

    const ticket = await client.verifyIdToken({
      idToken: req.body.idtoken,
      audience: config.get("GOOGLE_CLIENT_ID")
    });
    const payload = ticket.getPayload();

    const googleUserId = payload.sub;

    let user = await db.users.getUserByGoogleId(googleUserId);

    if (!user) {
      user = await db.users.createGoogleUser(payload.name, payload.email, payload.picture, googleUserId);
    }

    token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 * 7 // expires in 7 days
    });

    await db.users.saveJwtUserToken(
      user.id,
      user.username,
      token
    );

    res.json({
      id: user.id,
      username: user.username,
      googleUserId: user.google_user_id,
      email: user.email,
      token
    });
  });

  router.post("/facebook-sign-up", async (req, res) => {
    const { accessToken, userID } = req.body;

    if (!accessToken && !userID) {
      res.status(400).json({ msg: "MISSING_CREDENTIALS" });
    }

    const fbGraphApi = "https://graph.facebook.com/v3.1/me";
    const response = await requestPromise({
      uri: `${fbGraphApi}?fields=id,name,email,picture&access_token=${accessToken}`,
      json: true
    });

    const { id, name, email, picture: { data: { url: picture } } } = response;

    let usernameExist = await db.users.checkUserNameExists(name);

    if (usernameExist) {
      return res.status(400).json({ msg: "USER_NAME_ALREADY_EXITS"});
    }

    let user = await db.users.getUserByFacebookId(id);


    if (!user) {
      user = await db.users.createFacebookUser(name, email, picture, id);
    }

    token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 * 7 // expires in 7 days
    });

    await db.users.saveJwtUserToken(
      user.id,
      user.username,
      token
    );

    res.json({
      id: user.id,
      username: user.username,
      facebookUserId: user.facebook_user_id,
      email: user.email,
      token
    });
  });

  router.get("/me", mw.requireLoggedIn, async (req, res) => {
    return res.json(req.currentUser);
  });

  return router;
};
