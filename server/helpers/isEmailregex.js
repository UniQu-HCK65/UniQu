function validateEmail(email) {
  var re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  return re.test(email);
}

module.exports = { validateEmail };
