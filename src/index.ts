import { NextFunction, Request, Response } from "express";
const fido2lib = require('fido2-lib')

/**
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined} 
 */
async function attestationOptions(req: Request, res: Response, next: NextFunction) {
  if (!req.body || !req.body.username || !req.body.displayName) {
    return res.json({
      'status': 'failed',
      'errorMessage': 'Request missing display name or username field!'
    })
  }

  const serve = new fido2lib.Fido2Lib();
  const options = await serve.attestationOptions();
  options.status = 'ok';
  options.errorMessage = '';
  options.user.name = req.body.username;
  options.user.displayName = req.body.displayName;
  if (req.session) {
    req.session.challenge = options.challenge;
  }

  res.json(options);
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