import { Request } from "express";
interface AssertionOptions {
    challenge: String;
    timeout: Number;
    status: String;
    allowCredentials: any;
    errorMessage: String;
    extensions: any;
    userVerification: String;
}
/**
 *
 * @param {Object} req - Express request object
 * @returns {undefined}
 */
export declare function assertionOptions(req: Request): Promise<AssertionOptions>;
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
export declare function assertionResult(req: Request): Promise<{
    status: string;
    errorMessage: string;
}>;
export {};
