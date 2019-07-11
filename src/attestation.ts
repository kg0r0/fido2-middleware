import { Request } from "express";
import {
  isBase64UrlEncoded,
  randomBase64URLBuffer,
  preFormatAttestationResultReq,
  isRequestBody,
  Fido2MiddleWareConfig,
  AuthrInfo
} from "./util";
import config from "config";
import base64url from "base64url";
const fido2lib = require("fido2-lib");
const cache = require("./cache");
const fido2MiddlewareConfig: Fido2MiddleWareConfig = config.get(
  "fido2-middlewareConfig"
);

interface RequestBody {
  id: String;
  rawId: String;
  response: any;
  type: String;
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

interface AttestationExpected {
  challenge: String;
  origin: String;
  factor: String;
}

/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
export async function attestationOptions(req: Request) {
  if (!req.body || !req.body.username || !req.body.displayName)
     throw new Error("Request missing display name or username field!")

  let excludeCredentials;
  if (!fido2MiddlewareConfig.db) {
    const cacheData = await cache.getAsync(req.body.username);
    if (cacheData && cacheData.registered) {
      excludeCredentials = [
        {
          type: "public-key",
          id: cacheData.authenticators[0].credID
        }
      ];
    } else {
      await cache.setAsync(req.body.username, {
        name: req.body.displayName,
        registerd: false,
        id: randomBase64URLBuffer(32),
        authenticators: []
      });
    }
  }

  const fido2Lib = new fido2lib.Fido2Lib(fido2MiddlewareConfig.fido2lib);
  const result = await fido2Lib.attestationOptions().catch((err: Error) => {
    return {
      status: "failed",
      errorMessage: err.message
    };
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

  return options;
}

/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
export async function attestationResult(req: Request) {
  if (!(req.body != null && isRequestBody(req.body)))
      throw new Error("Response missing one or more of id/rawId/response/type fields")

  if (req.body.type !== "public-key")
      throw new Error("type is not public-key!")

  if (!isBase64UrlEncoded(req.body.id))
      throw new Error("Invalid id!")

  const fido2Lib = new fido2lib.Fido2Lib();
  const expected: AttestationExpected = {
    challenge: req.session ? req.session.challenge : "",
    origin: fido2MiddlewareConfig.origin || "localhost",
    factor: fido2MiddlewareConfig.factor || "either"
  };
  const requestBody: RequestBody = preFormatAttestationResultReq(req.body);
  const result = await fido2Lib
    .attestationResult(requestBody, expected)
    .catch((err: Error) => {
      return {
        status: "failed",
        errorMessage: err.message
      };
    });

  const authrInfo: AuthrInfo = {
    fmt: result.authnrData.get("fmt"),
    publicKey: result.authnrData.get("credentialPublicKeyPem"),
    counter: result.authnrData.get("counter"),
    credID: base64url.encode(result.authnrData.get("credId"))
  };

  if (req.session) {
    const cacheData = await cache.getAsync(req.session.username);
    let authenticators = [];
    if (cacheData) {
      authenticators = cacheData.authenticators;
    }
    authenticators.push(authrInfo);
    const obj = {
      authenticators: authenticators,
      registered: true
    };
    await cache.setAsync(req.session.username, obj);
    req.session.loggedIn = true;
  }

  return {
    status: "ok",
    errorMessage: ""
  };
}
