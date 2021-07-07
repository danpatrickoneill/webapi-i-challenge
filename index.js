// implement your API here
const express = require("express");

const db = require("./data/db");

const server = express();

server.use(express.json());

// GET request for all users
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({
        error: "The users information could not be retrieved."
      });
    });
});

// GET request for specific user
server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

// POST request for new user
server.post("/api/users", (req, res) => {
  const newUser = req.body;
  console.log(newUser);

  if (newUser.hasOwnProperty("name") && newUser.hasOwnProperty("bio")) {
    db.insert(newUser)
      .then(user => {
        res.status(201).json({ success: true, user });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          error: "There was an error while saving the user to the database"
        });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
});

// PUT request to edit specific user
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const modifiedUser = req.body;
  console.log(modifiedUser);

  db.update(id, modifiedUser)
    .then(user => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });
});

// DELETE request for specific user
server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(200).json({});
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The user could not be removed" });
    });
});

server.listen(3000, () => console.log("Server running on port 3000"));
