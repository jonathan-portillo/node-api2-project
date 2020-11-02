const express = require("express");
const router = express.Router();
const posts = require("../data/db");

//array of posts
router.get("/", (req, res) => {
  posts
    .find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving posts" });
    });
});

//find post with id
router.get("/:id", (req, res) => {
  posts
    .findById(req.params.id)
    .then((post) => {
      if (posts) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post was not found" });
      }
    })
    .catch((err) => {
      console.log("Error getting post id", err);
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

//get comments
router.get("/:id/comments", (req, res) => {
  posts
    .findCommentById(req.params.id)
    .then((comment) => {
      if (posts) {
        res.status(200).json(comment);
      } else {
        console.log("Error getting comment id", err);
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((err) => {
      console.log("Error getting comments", err);
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved" });
    });
});

//add a new post
router.post("/", (req, res) => {
  const newPost = req.body;
  posts
    .insert(newPost)
    .then((post) => {
      if (!newPost.title || !newPost.contents) {
        res
          .status(400)
          .json({ message: "Please provide title and contents for the post" });
      } else {
        res.status(201).json(post);
      }
    })
    .catch((err) => {
      console.log(("Error creating a new post", err));
      res.status(500).json({
        message: "There was an error while saving the post to the database",
      });
    });
});

//add a comment to a post
router.post("/:id/comments", (req, res) => {
  const newComment = req.body;
  const id = req.body.id;

  if (id !== req.params.id) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist" });
  } else {
    posts
      .insertComment(newComment)
      .then((post) => {
        if (!newCommment.text) {
          res.status(400).json({ message: "Please provide text for comment" });
        } else {
          res.status(201).json(post);
        }
      })
      .catch((err) => {
        console.log("Error with posting comment", err);
        res.status(500).json({
          message:
            "There was an error while saving the comment to the database",
        });
      });
  }
});

//delete entire post
router.delete("/:id", (req, res) => {
  posts
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res
          .status(200)
          .json({ message: "The post has been deleted, please refresh" });
      } else {
        res.status(404).json({ message: "Post does not exist" });
      }
    })
    .catch((error) => {
      console.log("Error router DELETE ", error);
      res.status(500).json({ message: "Error deleting the specified id post" });
    });
});

module.exports = router;
