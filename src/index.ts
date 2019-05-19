import { NextFunction, Request, Response } from "express";
const fido2lib = require("fido2-lib");
const crypto = require("crypto");
const base64url = require("base64url");

function randomBase64URLBuffer(len: number) {
  len = len || 32;
  const buff = crypto.randomBytes(len);

  return base64url(buff);
}

/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
async function attestationOptions(req: Request, res: Response) {
  if (!req.body || !req.body.username || !req.body.displayName) {
    return res.json({
      status: "failed",
      errorMessage: "Request missing display name or username field!"
    });
  }

  // TODO
  let excludeCredentials;

  const serve = new fido2lib.Fido2Lib();
  const options = await serve.attestationOptions();

  options.status = "ok";
  options.errorMessage = "";
  options.extensions = req.body.extensions;
  options.authenticatorSelection = req.body.authenticatorSelection;
  options.excludeCredentials = excludeCredentials;
  options.user.name = req.body.username;
  options.user.id = randomBase64URLBuffer(32);
  options.challenge = randomBase64URLBuffer(32);
  options.user.displayName = req.body.displayName;
  if (req.session) {
    req.session.challenge = options.challenge;
    req.session.username = req.body.username;
  }

  return res.json(options);
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
};
