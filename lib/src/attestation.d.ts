import { Request, Response } from "express";
interface AttestationOptions {
    rp: any;
    user: any;
    challenge: String;
    pubKeyCredParams: Object[];
    timeout: Number;
    attestation: String;
    status: String;
    errorMessage: String;
    extensions: any;
    authenticatorSelection: Object | unknown;
    excludeCredentials: Object[] | unknown;
}
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
export declare function attestationOptions(req: Request, res: Response): Promise<AttestationOptions | {
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
export declare function attestationResult(req: Request, res: Response): Promise<{
    status: string;
    errorMessage: string;
}>;
export {};
