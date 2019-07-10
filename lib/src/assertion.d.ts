import { Request, Response } from "express";
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
 * @param {Object} res - Express response object
 * @returns {undefined}
 */
export declare function assertionOptions(req: Request, res: Response): Promise<AssertionOptions | {
    status: string;
    errorMessage: string;
}>;
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
export declare function assertionResult(req: Request, res: Response): Promise<{
    status: string;
    errorMessage: any;
} | undefined>;
export {};
