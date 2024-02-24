export * from "./error.enum.js";

export class CustomError{
    static createError(message, name="Error", status) {
        const error = new Error(`${message}.`);
        error.name = name;
        error.status = status
        return error;
    };
};