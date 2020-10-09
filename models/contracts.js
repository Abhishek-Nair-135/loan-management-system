const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
    contractId: { type: mongoose.Schema.Types.ObjectId, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    startDate: String,
    noOfYears: Number,
    interestRate: Number,
    loanAmount: Number,
    remainingAmount: Number,
    amountDue: Number,
    dueDate: String,
    status: String
});

module.exports = mongoose.model('Contract', contractSchema);