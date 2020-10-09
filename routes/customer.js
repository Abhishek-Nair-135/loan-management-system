const express = require("express");
const router = express.Router();
const Contract = require("../models/contracts");
const { basicAuth, customerAuth } = require("../auth");

router.get("/list", basicAuth, customerAuth, (req, res, next) => {
  const filter = {};
  if(req.query.startDate !== undefined && new Date(req.query.startDate) != "Invalid Date")
    filter["startDate"] = new Date(req.query.startDate).toDateString();
  
  if(req.query.status !== undefined && /["NEW", "APPROVED", "REJECTED"]/.test(req.query.status))
    filter["status"] = req.query.status;

  Contract.find({userId: req.userData.userId, ...filter})
    .exec()
    .then((contracts) => {
     return res.status(200).json({
        contracts: contracts,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        error: err,
      });
    });
});

router.get("/view/:contractId", basicAuth, customerAuth, (req, res, next) => {
  const filter = {};
  if(req.query.startDate !== undefined && new Date(req.query.startDate) != "Invalid Date")
    filter["startDate"] = new Date(req.query.startDate).toDateString();
  
  if(req.query.status !== undefined && /["NEW", "APPROVED", "REJECTED"]/.test(req.query.status))
    filter["status"] = req.query.status;

  Contract.findOne({ userId: req.userData.userId, contractId: req.params.contractId, ...filter })
    .exec()
    .then((contract) => {
      res.status(200).json({
        contract: contract,
      });
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
      });
    });
});

module.exports = router;
