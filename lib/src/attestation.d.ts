import { Request, Response } from "express";
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
export declare function attestationOptions(req: Request, res: Response): Promise<import("express-serve-static-core").Response>;
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
export declare function attestationResult(req: Request, res: Response): Promise<import("express-serve-static-core").Response>;
