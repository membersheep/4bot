module.exports = function status(req, res, next) {
  res.json({ status: 'UP' });
};
