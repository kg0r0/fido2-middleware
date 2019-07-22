import { Request } from "express";
import {
  randomBase64URLBuffer,
  preFormatAssertionResultReq,
  assertionResultReqValidator,
  assertionClientDataJSONValidator,
  Fido2MiddleWareConfig,
  ClientDataJSON,
  AuthrInfo
} from "./util";
import config from "config";
import base64url from "base64url";
const fido2lib = require("fido2-lib");
const cache = require("./cache");
const fido2MiddlewareConfig: Fido2MiddleWareConfig = config.get(
  "fido2-middlewareConfig"
);

interface AssertionOptions {
  challenge: String;
  timeout: Number;
  status: String;
  allowCredentials: any;
  errorMessage: String;
  extensions: any;
  userVerification: String;
}

interface AssertionExpected {
  challenge: String;
  origin: String;
  factor: String;
  publicKey: String;
  prevCounter: Number;
  userHandle: String | null;
}

export function findAuthr(credID: String, authenticators: AuthrInfo[]) {
  for (let authr of authenticators) {
    if (authr.credID === credID) return authr;
  }
  throw new Error(`Unknown authenticator with credID ${credID}`);
}

/**
 *
 * @param {Object} req - Express request object
 * @returns {undefined}
 */
export async function assertionOptions(req: Request) {
  if (!req.body || !req.body.username)
    throw new Error("Request missing username field!");

  const cacheData = await cache.getAsync(req.body.username);
  const authenticators = cacheData ? cacheData.authenticators : [];
  let allowCredentials = [];
  for (let authr of authenticators) {
    allowCredentials.push({
      type: "public-key",
      id: authr.credID
    });
  }

  const serve = new fido2lib.Fido2Lib();
  const result = await serve.assertionOptions();
  const options: AssertionOptions = {
    challenge: randomBase64URLBuffer(32),
    timeout: result.timeout,
    status: "ok",
    allowCredentials: allowCredentials,
    errorMessage: "",
    extensions: req.body.extensions,
    userVerification: req.body.userVerification || "preferred"
  };
  if (req.session) {
    req.session.challenge = options.challenge;
    req.session.username = req.body.username;
    req.session.userVerification = options.userVerification;
  }
  return options;
}

/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
export async function assertionResult(req: Request) {
  assertionResultReqValidator(req.body);

  const clientData: ClientDataJSON = JSON.parse(
    base64url.decode(req.body.response.clientDataJSON)
  );

  assertionClientDataJSONValidator(req, clientData);

  let authenticators;
  if (req.session) {
    const cacheData = await cache.getAsync(req.session.username);
    authenticators = cacheData.authenticators;
  }

  const authr = findAuthr(req.body.id, authenticators);

  const fido2Lib = new fido2lib.Fido2Lib();
  const expected: AssertionExpected = {
    challenge: clientData.challenge,
    origin: fido2MiddlewareConfig.origin,
    factor: fido2MiddlewareConfig.factor,
    publicKey: authr.publicKey,
    prevCounter: authr.counter,
    userHandle: req.body.response.userHandle || null
  };
  const requestBody = preFormatAssertionResultReq(req.body);
  const result = await fido2Lib
    .assertionResult(requestBody, expected)
    .catch((err: Error) => {
      return {
        status: "failed",
        errorMessage: err.message
      };
    });

  if (req.session) {
    req.session.loggedIn = true;
  }

  return {
    status: result.status || "ok",
    errorMessage: result.errorMessage || ""
  };
}
