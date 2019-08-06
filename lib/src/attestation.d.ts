import { Request } from "express";
interface AttestationOptions {
    rp: rp;
    user: user;
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
interface rp {
    name: String;
    id: String | unknown;
}
interface user {
    id: String;
    name: String;
    dispalyName: String;
}
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
export declare function attestationOptions(req: Request): Promise<AttestationOptions>;
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
export declare function attestationResult(req: Request): Promise<{
    status: string;
    errorMessage: string;
}>;
export {};
