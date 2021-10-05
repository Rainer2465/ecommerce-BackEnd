const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  console.log(
    error.message,
    "ERROR MESSAGE------------------------------------"
  );
  // Log to console for dev
  console.log(err, "Error Message");

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
