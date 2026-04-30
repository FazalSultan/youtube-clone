class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    cause = "",
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.cause = cause;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
