import { Request, Response } from "express";
import {
  isBase64UrlEncoded,
  randomBase64URLBuffer,
  toArrayBuffer,
  isRequestBody
} from "./util";
import config from "config";
import base64url from "base64url";
import { database } from "./db";
const fido2lib = require("fido2-lib");
const str2ab = require("string-to-arraybuffer");
const fido2MiddlewareConfig: Fido2MiddleWareConfig = config.get(
  "fido2-middlewareConfig"
);
interface Fido2MiddleWareConfig {
  db: any;
  factor: String;
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
  type: String;
}

interface ResponseBody {
  status: String;
  errorMessage: String | unknown;
}
interface AuthrInfo {
  fmt: String;
  publicKey: String;
  counter: Number;
  credID: String;
}

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

interface AssertionOptions {
  challenge: String;
  timeout: Number;
  status: String;
  allowCredentials: any;
  errorMessage: String;
  extensions: any;
  userVerification: String;
}

interface ClientDataJSON {
  challenge: String;
  origin: String;
  type: String;
}

interface AttestationExpected {
  challenge: String;
  origin: String;
  factor: String;
}

interface AssertionExpected {
  challenge: String;
  origin: String;
  factor: String;
  publicKey: String;
  prevCounter: Number;
  userHandle: String | null;
}

function preFormatResultReq(reqBody: RequestBody): RequestBody {
  if (reqBody.response.authenticatorData) {
    reqBody.response.authenticatorData = toArrayBuffer(
      base64url.toBuffer(reqBody.response.authenticatorData)
    );
  }
  reqBody.id = str2ab(reqBody.id);
  reqBody.rawId = str2ab(reqBody.rawId);
  return reqBody;
}

function findAuthr(credID: String, authenticators: AuthrInfo[]) {
  for (let authr of authenticators) {
    if (authr.credID === credID) return authr;
  }
  throw new Error(`Unknown authenticator with credID ${credID}`);
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
  const result = await fido2Lib.attestationOptions().catch((err: Error) => {
    return res.json({
      status: "failed",
      errorMessage: err.message
    });
  });
  result.user.name = req.body.username;
  result.user.id = randomBase64URLBuffer(32);
  result.user.displayName = req.body.displayName;
  const options: AttestationOptions = {
    rp: result.rp,
    user: result.user,
    challenge: randomBase64URLBuffer(32),
    pubKeyCredParams: result.pubKeyCredParams,
    timeout: result.timeout,
    attestation: result.attestation,
    status: "ok",
    errorMessage: "",
    extensions: req.body.extensions,
    authenticatorSelection: req.body.authenticatorSelection,
    excludeCredentials: excludeCredentials
  };
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
  if (!(req.body != null && isRequestBody(req.body))) {
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
  const expected: AttestationExpected = {
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
  const authrInfo: AuthrInfo = {
    fmt: result.authnrData.get("fmt"),
    publicKey: result.authnrData.get("credentialPublicKeyPem"),
    counter: result.authnrData.get("counter"),
    credID: base64url.encode(result.authnrData.get("credId"))
  };

  if (req.session) {
    database[req.session.username].authenticators.push(authrInfo);
    database[req.session.username].registerd = true;
    req.session.loggedIn = true;
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
 * @returns {undefined}
 */
async function assertionOptions(req: Request, res: Response) {
  if (!req.body || !req.body.username) {
    return res.json({
      status: "failed",
      errorMessage: "Request missing username field!"
    });
  }

  const authenticators = database[req.body.username].authenticators;
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
  return res.json(options);
}

/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
async function assertionResult(req: Request, res: Response) {
  if (!(req.body != null && isRequestBody(req.body))) {
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
    res.json({
      status: "failed",
      errorMessage: "Invalid id!"
    });
    return;
  }

  const clientData: ClientDataJSON = JSON.parse(
    base64url.decode(req.body.response.clientDataJSON)
  );

  let authenticators;
  if (req.session) {
    authenticators = database[req.session.username].authenticators;
  }

  const authr = findAuthr(req.body.id, authenticators);

  const fido2Lib = new fido2lib.Fido2Lib();
  const expected: AssertionExpected = {
    challenge: clientData.challenge,
    origin: fido2MiddlewareConfig.origin || "localhost",
    factor: fido2MiddlewareConfig.factor || "either",
    publicKey: authr.publicKey,
    prevCounter: authr.counter,
    userHandle: null
  };
  let errorMessage;
  const requestBody = preFormatResultReq(req.body);
  const result = await fido2Lib
    .assertionResult(requestBody, expected)
    .catch((err: Error) => {
      errorMessage = err.message;
    });

  if (!result || errorMessage) {
    return res.json({
      status: "failed",
      errorMessage: errorMessage
    });
  }

  if (req.session) {
    req.session.loggedIn = true;
  }

  return res.json({
    status: "ok",
    errorMessage: ""
  });
}

module.exports = {
  attestationOptions,
  attestationResult,
  assertionOptions,
  assertionResult
};
