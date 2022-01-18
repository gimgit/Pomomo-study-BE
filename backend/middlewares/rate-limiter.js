const rateLimit = require("express-rate-limit");

const apiLimit = rateLimit({
  windowMx: 60000,
  maxRequest: 100,
});

module.exports = apiLimit;
