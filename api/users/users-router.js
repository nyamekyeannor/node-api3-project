const express = require("express");

// You will need `users-model.js` and `posts-model.js` both
const User = require("../users/users-model");
const Post = require("../posts/posts-model");
// The middleware functions also need to be required
const {
  errorHandling,
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");

const router = express.Router();

router.get("/", (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user);
});

router.post("/", validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  User.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      next(error);
    });
});

router.put("/:id", validateUser, validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  User.update(req.params.id, req.body)
    .then((hub) => {
      res.json(hub);
    })
    .catch((error) => {
      next(error);
    });
});

router.delete("/:id", validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  User.remove(req.params.id)
    .then((count) => {
      res.status(200).json(req.user);
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/:id/posts", validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  User.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/:id/posts", validatePost, validateUserId, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  console.log("This is req.body", req.body);
  Post.insert({ text: req.body.text, user_id: req.params.id })
    .then((p) => {
      res.status(200).json(p);
    })
    .catch((error) => {
      next(error);
    });
});

// do not forget to export the router
router.use(errorHandling);

module.exports = router;
