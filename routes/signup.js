const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require('bcrypt');

const Users = require("../models/users");

router.post("/", (req, res, next) => {
  Users.find({ userName: req.body.userName })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User already exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new Users({
              _id: new mongoose.Types.ObjectId(),
              userName: req.body.userName,
              password: hash,
              role: req.body.role
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

module.exports = router;
