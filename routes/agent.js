const express = require("express");
const router = express.Router();
const Contract = require("../models/contracts");
const { basicAuth, agentAuth } = require("../auth");
const mongoose = require("mongoose");

router.post("/create", basicAuth, agentAuth, (req, res, next) => {
  const interestRate = req.body.interestRate;
  const startDate = new Date().toDateString();
  const noOfYears = req.body.noOfYears;
  const loanAmount = req.body.loanAmount;
  const dueDate = new Date(
    new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)
  ).toDateString();

  const interest = (loanAmount * interestRate * noOfYears) / 100 / 12;
  const amountDue = Math.round(
    (Math.pow((interestRate * noOfYears) / 100 / 12 + 1, noOfYears * 12) /
      (Math.pow((interestRate * noOfYears) / 100 / 12 + 1, noOfYears * 12) -
        1)) *
      interest
  );

  const contract = new Contract({
    contractId: mongoose.Types.ObjectId(),
    user: req.body.userId,
    startDate: startDate,
    noOfYears: noOfYears,
    interestRate: interestRate,
    loanAmount: loanAmount,
    remainingAmount: loanAmount,
    amountDue: amountDue,
    dueDate: dueDate,
    status: "NEW",
  });

  contract
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Loan applied successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/list", basicAuth, agentAuth, (req, res, next) => {
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
      res.status(200).json({
        contracts: contracts,
      });
    })
    .catch((err) => {
      res.status(404).json({
        error: err,
      });
    });
});

router.get("/view/:contractId", (req, res, next) => {
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

  Contract.findOne({ contractId: req.params.contractId, ...filter })
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

router.patch("/edit", basicAuth, agentAuth, (req, res, next) => {
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

      const interest = (remainingAmount * interestRate * noOfYears) / 100 / 12;
      const amountDue = Math.round(
        (Math.pow((interestRate * noOfYears) / 100 / 12 + 1, noOfYears * 12) /
          (Math.pow((interestRate * noOfYears) / 100 / 12 + 1, noOfYears * 12) -
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
            message: "Loan updated",
            noOfUpdates: result.nModified,
          });
        })
        .catch((err) => {
          res.json({
            error: err,
          });
        });
    });
});

module.exports = router;
