//using the DRY method, we limit the use of trycatch handler on our controller
//we wrap our asyncAwait functions with this asyncHandler
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
