const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
    contractId: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    startDate: Date,
    noOfYears: Number,
    interestRate: Number,
    loanAmount: Number,
    remainingAmount: Number,
    amountDue: Number,
    dueDate: Date,
    status: String
});

module.exports = mongoose.model('Contract', contractSchema);