import crypto from "crypto";
import base64url from "base64url";

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
    bodyObject.id && bodyObject.rawId && bodyObject.response && bodyObject.type
  );
}
