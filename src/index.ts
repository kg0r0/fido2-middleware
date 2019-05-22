import { NextFunction, Request, Response } from "express";
import { isBase64UrlEncoded, randomBase64URLBuffer } from "./util";
import config from "config";
import { database } from "./db";
const fido2lib = require("fido2-lib");
const str2ab = require("string-to-arraybuffer");

const fido2MiddlewareConfig: Fido2MiddleWareConfig = config.get(
  "fido2-middlewareConfig"
);
interface Fido2MiddleWareConfig {
  db: any;
  factor: any;
  fido2lib: {
    timeout: Number;
    rpId: String;
    challengeSize: Number;
  };
  origin: String;
}

interface RequestBody {
  id: Number;
  rawId: String;
  response: any;
  type: any;
}

interface ResponseBody {
  status: string;
  errorMessage: string | null;
}

function isRequestBody(bodyObject: any): boolean {
  return (
    typeof bodyObject.id === "number" &&
    typeof bodyObject.rawId === "string" &&
    bodyObject.response != null &&
    bodyObject.type == null
  );
}

function preFormatResultReq(reqBody: RequestBody): RequestBody {
  reqBody.id = str2ab(reqBody.id);
  reqBody.rawId = str2ab(reqBody.rawId);
  return reqBody;
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
async function attestationResult(req: Request, res: Response) {
  if (!(req.body == null && isRequestBody(req.body))) {
    return res.json({
      status: "failed",
      errorMessage:
        "Response missing one or more of id/rawId/response/type fields"
    } as ResponseBody);
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
  interface Expected {
    challenge: String;
    origin: String;
    factor: String;
  }
  let expected: Expected = {
    challenge: req.session ? req.session.challenge : "",
    origin: fido2MiddlewareConfig.origin || "localhost",
    factor: fido2MiddlewareConfig.factor || "either"
  };
  const requestBody: RequestBody = preFormatResultReq(req.body);
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
