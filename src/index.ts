import { NextFunction, Request, Response } from "express";

/**
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined} 
 */
function attestationOptions(req: Request, res: Response, next: NextFunction) {
  next();
}

/**
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined} 
 */
function attestationResult(req: Request, res: Response, next: NextFunction) {
  next();
}

/**
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined} 
 */
function assertionOptions(req: Request, res: Response, next: NextFunction) {
  next();
}

/**
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined} 
 */
function assertionResult(req: Request, res: Response, next: NextFunction) {
  next();
}

module.exports = {
  attestationOptions,
  attestationResult,
  assertionOptions,
  assertionResult
}