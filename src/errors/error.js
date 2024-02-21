export * from "./error.enum.js";
export class CustomError {
    static async createError(message, name = "Error") {
        return new Promise((resolve, reject) => {
            const error = new Error(`${message}.`);
            error.name = name;
            reject(error);
        });
    }
}