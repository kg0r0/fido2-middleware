import { NextFunction, Request, Response } from "express";
const fido2lib = require("fido2-lib");
const crypto = require("crypto");
const base64url = require("base64url");
<<<<<<< HEAD
const config = require("config");
const database = require("./db");
const str2ab = require("string-to-arraybuffer");
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

function preformatResultReq(resultReq: Request) {
  resultReq.body.rawId = str2ab(resultReq.body.rawId);
  resultReq.body.id = str2ab(resultReq.body.id);
  return resultReq;
}

/**
 * Takes string and tries to verify base64 url encoded.
 * @param  {String} str
 * @return {Boolean}
 */
function isBase64UrlEncoded(str: String) {
  return !!str.match(/^[A-Za-z0-9\-_]+={0,2}$/);
}

/**
 *
=======

function randomBase64URLBuffer(len: number) {
  len = len || 32;
  const buff = crypto.randomBytes(len);

  return base64url(buff);
}

/**
 *
>>>>>>> af3087a25954ceb3e2866bfb4e133c154eddf58d
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

<<<<<<< HEAD
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
=======
  // TODO
  let excludeCredentials;

  const serve = new fido2lib.Fido2Lib();
  const options = await serve.attestationOptions();

>>>>>>> af3087a25954ceb3e2866bfb4e133c154eddf58d
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
async function attestationResult(req: Request, res: Response) {
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

  if (!isBase64UrlEncoded(req.body.id)) {
    return res.json({
      status: "failed",
      errorMessage: "Invalid id!"
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
  const requestBody = preformatResultReq(req).body;
  const result = await fido2Lib
    .attestationResult(requestBody, expected)
    .catch((err: Error) => {
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
  });
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
