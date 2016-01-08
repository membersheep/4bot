module.exports = function status(req, res, next) {
  console.log(req.body);
  res.json({ status: 'UP' });
};
