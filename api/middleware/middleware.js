const User = require("../users/users-model");
function logger(req, res, next) {
  console.log(`Method = ${req.method} path = ${req.path} Date = ${Date.now()}`);
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const user = await User.getById(req.params.id);
    if (user) {
      req.user = user; // saves other middlewarws a db trip
      next();
    } else {
      next({ status: 404, message: "user not found" });
    }
  } catch (error) {
    next(error);
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if (!req.body.name || !req.body.name.trim()) {
    next({ status: 400, message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if (!req.body.text) {
    next({ status: 400, message: "missing required text field" });
  } else {
    next();
  }
}

function errorHandling(err, req, res, next) {
  res.status(err.status || 500).json({
    message: `${err.message}`,
  });
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  errorHandling,
  validatePost,
};
