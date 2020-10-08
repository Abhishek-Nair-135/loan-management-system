const express = require("express");
const router = express.Router();
const Contract = require("../models/contracts");
const { basicAuth, adminAuth } = require("../auth");

router.get("/list", basicAuth, adminAuth, (req, res, next) => {
  Contract.find()
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
      const status = req.body.status;

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

router.patch("/approve/:contractId", basicAuth, adminAuth, (req, res, next) => {
  Contract.findById(req.params.contractId)
    .then((contract) => {
      return Object.assign(contract, { status: "APPROVED" });
    })
    .then((contract) => {
      return contract.save();
    })
    .then((updatedContract) => {
      res.json({
        msg: "model updated",
        updatedContract,
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
