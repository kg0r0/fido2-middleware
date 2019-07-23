import { Request } from "express";
import { AuthrInfo } from "./util";
interface AssertionOptions {
    challenge: String;
    timeout: Number;
    status: String;
    allowCredentials: any;
    errorMessage: String;
    extensions: any;
    userVerification: String;
}
export declare function findAuthr(credID: String, authenticators: AuthrInfo[]): AuthrInfo;
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
    status: any;
    errorMessage: any;
}>;
export {};
