const bcrypt = require("bcryptjs");

function hashPw(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

function comparePwDecrypted(password, hashedPw) {
  return bcrypt.compareSync(password, hashedPw);
}

module.exports = { hashPw, comparePwDecrypted };
