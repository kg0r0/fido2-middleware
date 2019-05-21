import { NextFunction, Request, Response } from "express";
const fido2lib = require("fido2-lib");
const crypto = require("crypto");
const base64url = require("base64url");
const config = require("config");
const database = require("./db");
const fido2MiddlewareConfig = config.get("fido2-middlewareConfig");

/**
 *
 * @param len
 */
function randomBase64URLBuffer(len: number) {
  len = len || 32;
  const buff = crypto.randomBytes(len);

  return base64url(buff);
}

/**
 * Takes string and tries to verify base64 url encoded.
 * @param  {String} b64UrlString
 * @return {Boolean}
 */
function isBase64UrlEncoded(b64UrlString: string) {
  if (b64UrlString.indexOf("+") !== -1) {
    return false;
  } else if (b64UrlString.indexOf("/") !== -1) {
    return false;
  } else if (b64UrlString.indexOf("=") !== -1) {
    return false;
  }
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

  let excludeCredentials;
  if (!fido2MiddlewareConfig.db) {
    if (database[req.body.username] && database[req.body.username].registered) {
      excludeCredentials = [
        {
          type: "public-key",
          id: database[req.body.username].authenticatorp[0].credID
        }
      ];
    } else {
      database[req.body.username] = {
        name: req.body.displayName,
        registerd: false,
        id: randomBase64URLBuffer(32),
        authenticators: []
      };
    }
  }

  const fido2Lib = new fido2lib.Fido2Lib(fido2MiddlewareConfig.fido2lib);
  const options = await fido2Lib.attestationOptions().catch((err: Error) => {
    return res.json({
      status: "failed",
      errorMessage: err.message
    });
  });
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
async function attestationResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    !req.body ||
    !req.body.id ||
    !req.body.rawId ||
    !req.body.response ||
    !req.body.type
  ) {
    return res.json({
      status: "failed",
      errorMessage:
        "Response missing one or more of id/rawId/response/type fields"
    });
  }

  if (req.body.type !== "public-key") {
    return res.json({
      status: "failed",
      errorMessage: "type is not public-key!"
    });
  }


  const fido2Lib = new fido2lib.Fido2Lib();
  let expected = {
    challenge: String,
    origin: String,
    factor: String
  };
  if (req.session) {
    expected.challenge = req.session.challenge;
  }
  expected.origin = fido2MiddlewareConfig.origin || "localhost";
  expected.factor = fido2MiddlewareConfig.factor || "either";
  const result = await fido2Lib.attestationResult(res, expected).catch((err: Error) => {
    return res.json({
      status: "failed",
      errorMessage: err.message
    });
  });

  if (!result) {
    return res.json({
      status: "failed",
      errorMessage: "Can not authenticate signature!"
    });
  }
  return res.json({
    status: "ok",
    errorMessage: ""
  })
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
