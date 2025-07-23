function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function errorHandler(err, req, res, _next) {
  console.error(err);
  const wantsJson = req.path.startsWith('/api') || req.headers.accept && req.headers.accept.includes('application/json');
  if (wantsJson) {
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  } else {
    res.status(err.status || 500);
    try {
      res.render('error', { message: err.message || 'Internal Server Error' });
    } catch {
      res.send(err.message || 'Internal Server Error');
    }
  }
}

module.exports = { asyncHandler, errorHandler };
