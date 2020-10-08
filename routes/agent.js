const express = require("express");
const router = express.Router();
const Contract = require("../models/contracts");
var addMonths = require("date-fns/addMonths");
const { basicAuth, agentAuth } = require("../auth");

router.post("/create", basicAuth, agentAuth, (req, res, next) => {
  const interestRate = req.body.interestRate;
  const startDate = new Date().now().toUTCString();
  const noOfYears = req.body.noOfYears;
  const loanAmount = req.body.loanAmount;

  const interest = (loanAmount * interestRate * noOfYears) / 100 / 12;
  const amountDue = Math.round(
    (Math.pow((interestRate * noOfYears) / 100 / 12 + 1, noOfYears * 12) /
      (Math.pow((interestRate * noOfYears) / 100 / 12 + 1, noOfYears * 12) -
        1)) *
    interest);

  const contract = new Contract({
    contractId: mongoose.Schema.Types.ObjectId,
    user: req.body.userId,
    startDate: startDate,
    noOfYears: noOfYears,
    interestRate: interestRate,
    loanAmount: loanAmount,
    remainingAmount: loanAmount,
    amountDue: amountDue,
    dueDate: addMonths(startDate, 1),
    status: "NEW",
  });

  contract
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Loan applied successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/list",  basicAuth, agentAuth, (req, res, next) => {
  Contract.find()
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

router.patch("/edit",  basicAuth, agentAuth, (req, res, next) => {
  Contract.findOne({
    contractId: req.body.contractId,
  })
    .exec()
    .then((contract) => {
      const interestRate = req.body.interestRate;
      const startDate = contract.startDate;
      const noOfYears = req.body.noOfYears;
      const remainingAmount = contract.remainingAmount;
      const user = req.body.userId;
      const status = contract.status;

      const interest = (remainingAmount * interestRate * noOfYears) / 100 / 12;
      const amountDue = Math.round(
        (Math.pow((interestRate * noOfYears) / 100 / 12 + 1, noOfYears * 12) /
          (Math.pow((interestRate * noOfYears) / 100 / 12 + 1, noOfYears * 12) -
            1)) *
        interest);

      const newContract = new Contract({
        contractId: contract.contractId,
        user: user,
        startDate: startDate,
        noOfYears: noOfYears,
        interestRate: interestRate,
        loanAmount: loanAmount,
        remainingAmount: remainingAmount,
        amountDue: amountDue,
        dueDate: contract.dueDate,
        status: status,
      });

      newContract
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: "Loan updates successfully",
            contract: newContract,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    });
});

module.exports = router;
