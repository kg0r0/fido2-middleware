import { Request, Response } from "express";
import {
  isBase64UrlEncoded,
  randomBase64URLBuffer,
  preFormatResultReq,
  isRequestBody
} from "./util";
import config from "config";
import base64url from "base64url";
const fido2lib = require("fido2-lib");
const cache = require("./cache");
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
  cookie: {
    name: string;
    maxAge: number;
    httpOnly: boolean;
  }
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

interface AssertionExpected {
  challenge: String;
  origin: String;
  factor: String;
  publicKey: String;
  prevCounter: Number;
  userHandle: String | null;
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
 * @returns {undefined}
 */
export async function assertionOptions(req: Request, res: Response) {
  if (!req.body || !req.body.username) {
    return {
      status: "failed",
      errorMessage: "Request missing username field!"
    };
  }

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
export async function assertionResult(req: Request, res: Response) {
  let errorMessage;
  if (!(req.body != null && isRequestBody(req.body))) {
    return {
      status: "failed",
      errorMessage:
        "Response missing one or more of id/rawId/response/type fields"
    };
  }

  if (req.body.type !== "public-key") {
    return {
      status: "failed",
      errorMessage: "type is not public-key!"
    };
  }
  let isBase64Url;
  try {
    isBase64Url = isBase64UrlEncoded(req.body.id);
  } catch (e) {
    errorMessage = e.message;
  }

  if (!isBase64Url || errorMessage) {
    res.json({
      status: "failed",
      errorMessage: errorMessage || "Invalid id!"
    });
    return;
  }

  let clientData: ClientDataJSON = {
    challenge: "",
    type: "",
    origin: ""
  };
  try {
    clientData = JSON.parse(
      base64url.decode(req.body.response.clientDataJSON)
    )
  } catch (e) {
    errorMessage = e.message;
  }

  let authenticators;
  if (req.session) {
    const cacheData = await cache.getAsync(req.session.username);
    authenticators = cacheData.authenticators;
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
  const requestBody = preFormatResultReq(req.body);
  const result = await fido2Lib
    .assertionResult(requestBody, expected)
    .catch((err: Error) => {
      errorMessage = err.message;
    });

  if (!result || errorMessage) {
    return {
      status: "failed",
      errorMessage: errorMessage
    };
  }

  if (req.session) {
    req.session.loggedIn = true;
  }

  return {
    status: "ok",
    errorMessage: ""
  };
}