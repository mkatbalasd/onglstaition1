module.exports = function asyncHandler(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('asyncHandler expects a function');
  }
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
