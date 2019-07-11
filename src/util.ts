import crypto from "crypto";
import { Request } from "express";
import base64url from "base64url";
import config from "config";
const fido2MiddlewareConfig: Fido2MiddleWareConfig = config.get(
  "fido2-middlewareConfig"
);
const str2ab = require("string-to-arraybuffer");

export interface Fido2MiddleWareConfig {
  db: any;
  factor: String;
  fido2lib: {
    timeout: Number;
    rpId: String;
    challengeSize: Number;
  };
  origin: String;
  attestationOptionsPath: String;
  attestationResultPath: String;
  assertionOptionsPath: String;
  assertionResultPath: String;
  cookie: {
    name: string;
    maxAge: number;
    httpOnly: boolean;
  };
}

interface RequestBody {
  id: String;
  rawId: String;
  response: any;
  type: String;
}

interface preFormatRequestBody {
  id: ArrayBuffer;
  rawId: ArrayBuffer;
  response: any;
  type: String;
}

export interface ClientDataJSON {
  challenge: String;
  origin: String;
  type: String;
  tokenBinding: String;
}

export interface AuthrInfo {
  fmt: String;
  publicKey: String;
  counter: Number;
  credID: String;
}

/**
 *
 * @param {Number} len
 * @returns {String}
 */
export function randomBase64URLBuffer(len: number): string {
  len = len || 32;
  const buff = crypto.randomBytes(len);
  return base64url(buff);
}

/**
 * Takes string and tries to verify base64 url encoded.
 * @param  {String} str
 * @return {Boolean}
 */
export function isBase64UrlEncoded(str: String): boolean {
  return !!str.match(/^[A-Za-z0-9\-_]+={0,2}$/);
}

/**
 *
 * @param {Buffer} buf
 * @returns {ArrayBuffer}
 */
export function toArrayBuffer(buf: Buffer): ArrayBuffer {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

/**
 * Takes object and tires to verify request body.
 * @param {Object} bodyObject
 * @returns {Boolean}
 */
export function isRequestBody(bodyObject: any): boolean {
  return (
    bodyObject.id != null &&
    bodyObject.rawId != null &&
    bodyObject.response != null &&
    bodyObject.type != null
  );
}

/**
 *
 * @param {RequestBody} reqBody
 * @returns {RequestBody}
 */
export function preFormatAttestationResultReq(reqBody: RequestBody) {
  return {
    id: str2ab(reqBody.id),
    rawId: str2ab(reqBody.rawId),
    response: reqBody.response,
    type: reqBody.type
  };
}

/**
 *
 * @param {RequestBody} reqBody
 * @returns {RequestBody}
 */
export function preFormatAssertionResultReq(
  reqBody: RequestBody
): preFormatRequestBody {
  if (reqBody.response.authenticatorData) {
    reqBody.response.authenticatorData = toArrayBuffer(
      base64url.toBuffer(reqBody.response.authenticatorData)
    );
  }
  return {
    id: str2ab(reqBody.id),
    rawId: str2ab(reqBody.rawId),
    response: reqBody.response,
    type: reqBody.type
  };
}

/**
 *
 * @param req
 * @param clientDataJSON
 * @param {Object}
 */
export function assertionClientDataJSONValidater(
  req: Request,
  clientDataJSON: ClientDataJSON
) {
  if (req.session && clientDataJSON.challenge !== req.session.challenge) {
    return {
      status: "failed",
      errorMessage: "Challenges don't match!"
    };
  }
  if (clientDataJSON.origin !== fido2MiddlewareConfig.origin) {
    return {
      status: "failed",
      errorMessage: "Origins don't match!"
    };
  }

  if (clientDataJSON.type !== "webauthn.get") {
    return {
      status: "failed",
      errorMessage: "Type don't match!"
    };
  }

  if (clientDataJSON.tokenBinding) {
    return {
      status: "failed",
      errorMessage: "Token Binding don`t support!"
    };
  }
  return {
    status: "ok",
    errorMessage: ""
  };
}
