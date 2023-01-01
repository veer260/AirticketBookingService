const { StatusCodes } = require('http-status-codes');

class ValidationError extends Error {
    constructor(error ){
        super();
        explaination = [];
        error.errors.forEach(err => {
            explaination.push(err.message);
        });

        this.name = 'ValidationError';
        this.message = 'Not able to validate the date sent in the request';
        this.explaination = explaination;
        statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = ValidationError;