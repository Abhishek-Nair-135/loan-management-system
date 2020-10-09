const express = require("express");
const router = express.Router();
const Contract = require("../models/contracts");
const mongoose = require('mongoose');
const { basicAuth, adminAuth } = require("../auth");

router.get("/list", basicAuth, adminAuth, (req, res, next) => {
  const filter = {};
  if (
    req.query.startDate !== undefined &&
    new Date(req.query.startDate) != "Invalid Date"
  )
    filter["startDate"] = new Date(req.query.startDate).toDateString();

  if (
    req.query.status !== undefined &&
    /["NEW", "APPROVED", "REJECTED"]/.test(req.query.status)
  )
    filter["status"] = req.query.status;

  Contract.find(filter)
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

router.get("/view/:contractId", basicAuth, adminAuth, (req, res, next) => {
  const filter = {};
  if (
    req.query.startDate !== undefined &&
    new Date(req.query.startDate) != "Invalid Date"
  )
    filter["startDate"] = new Date(req.query.startDate).toDateString();

  if (
    req.query.status !== undefined &&
    /["NEW", "APPROVED", "REJECTED"]/.test(req.query.status)
  )
    filter["status"] = req.query.status;

  Contract.findOne({ contractId: req.params.contractId })
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

router.patch("/edit", basicAuth, adminAuth, (req, res, next) => {
  const interestRate = new Number(req.query.interestRate);
  const noOfYears = new Number(req.query.noOfYears);
  const contractId = new mongoose.Types.ObjectId(req.query.contractId);

    Contract.findOne({
      contractId: contractId,
    })
      .exec()
      .then((contract) => {
        const startDate = contract.startDate;
        const remainingAmount = contract.remainingAmount;
        const status = contract.status;

        const interest =
          (remainingAmount * interestRate * noOfYears) / 100 / 12;
        const amountDue = Math.round(
          (Math.pow((interestRate * noOfYears) / 100 / 12 + 1, noOfYears * 12) /
            (Math.pow(
              (interestRate * noOfYears) / 100 / 12 + 1,
              noOfYears * 12
            ) -
              1)) *
            interest
        );

        Contract.updateOne(
          { contractId: contract.contractId },
          {
            startDate: startDate,
            noOfYears: noOfYears,
            interestRate: interestRate,
            remainingAmount: remainingAmount,
            amountDue: amountDue,
            dueDate: contract.dueDate,
            status: status,
          }
        )
          .then((result) => {
            res.json({
              msg: "Loan updated",
              noOfUpdates: result.nModified,
            });
          })
          .catch((err) => {
            res.send(err);
          });
      });
});

router.patch("/approve/:contractId", basicAuth, adminAuth, (req, res, next) => {
  Contract.updateOne(
    { contractId: req.params.contractId },
    { status: "APPROVED" }
  )
    .then((result) => {
      res.json({
        message: "Loan Approved!!",
        noOfUpdates: result.nModified,
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
