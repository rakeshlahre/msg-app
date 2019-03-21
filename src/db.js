const promise = require("bluebird"),
  initOptions = {
    "promiseLib": promise, // overriding the default (ES6 Promise);
    error(error) {
      error.DB_ERROR = true;
    }
  },
  pgp = require("pg-promise")(initOptions),
  db = pgp("postgres://rakesh:rakesh@localhost:5432/chatapp");

module.exports = {
  users: require("./models/users")(db),
  db
};
