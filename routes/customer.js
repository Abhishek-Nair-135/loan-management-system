const express = require("express");
const router = express.Router();
const Contract = require("../models/contracts");
const { basicAuth, customerAuth } = require("../auth");

router.get("/list", basicAuth, customerAuth, (req, res, next) => {
  Contract.find( req.body.conditions )
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
  Contract.findOne({ contractId: req.params.contractId, ...req.body.conditions })
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
