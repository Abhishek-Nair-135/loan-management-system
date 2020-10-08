const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require("../models/users");

router.post("/", (req, res, next) => {
    Users.find({ userName: req.body.userName })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed",
            msg: "one"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed",
              msg: "two"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                userName: user[0].userName,
                userId: user[0]._id,
                role: user[0].role
              },
              "This is some seriously secure key!!!",
              {
                expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }
          res.status(401).json({
            message: "Auth failed",
            msg: "three"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  module.exports = router;