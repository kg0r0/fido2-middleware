import crypto from "crypto";
import base64url from "base64url";

/**
 *
 * @param len
 */
export function randomBase64URLBuffer(len: number) {
  len = len || 32;
  const buff = crypto.randomBytes(len);
  return base64url(buff);
}

/**
 * Takes string and tries to verify base64 url encoded.
 * @param  {String} str
 * @return {Boolean}
 */
export function isBase64UrlEncoded(str: String) {
  return !!str.match(/^[A-Za-z0-9\-_]+={0,2}$/);
}
