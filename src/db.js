const promise = require("bluebird"),
  initOptions = {
    "promiseLib": promise, // overriding the default (ES6 Promise);
    error(error) {
      error.DB_ERROR = true;
    }
  },
  pgp = require("pg-promise")(initOptions),
  db = pgp("postgres://jysyoqkwnynmom:9c053a160476b794bee3f3cb7c698ea5b4001b3a00df5987c4b2c5b0ab61a161@ec2-174-129-10-235.compute-1.amazonaws.com:5432/d46uaatquvi7bq");

module.exports = {
  users: require("./models/users")(db),
  db
};
