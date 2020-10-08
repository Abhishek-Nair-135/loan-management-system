const { ROLE } = require('../data')

function canViewLoan(user, project) {
  return (
    user.role === ROLE.ADMIN ||
    project.userId === user.id
  )
}

function scopedLoans(user, loans) {
  if (user.role === ROLE.ADMIN) return loans
  return loans.filter(loan => loan.userId === user.id)
}

function canDeleteLoan(user, loan) {
  return project.userId === user.id
}


module.exports = {
  canViewLoan,
  scopedLoans,
  canDeleteLoan
}