//error.js
class CustomError extends Error {
	constructor (name, message) {
		// Pass remaining arguments (including vendor specific ones) to parent constructor
		super(name, message);
		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, CustomError);
		}
		// Custom debugging information
		this.name = name;
		this.message = message;
	}
}

module.exports.CustomError = CustomError;
