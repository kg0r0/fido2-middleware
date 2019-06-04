"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var base64url_1 = __importDefault(require("base64url"));
/**
 *
 * @param len
 */
function randomBase64URLBuffer(len) {
    len = len || 32;
    var buff = crypto_1.default.randomBytes(len);
    return base64url_1.default(buff);
}
exports.randomBase64URLBuffer = randomBase64URLBuffer;
/**
 * Takes string and tries to verify base64 url encoded.
 * @param  {String} str
 * @return {Boolean}
 */
function isBase64UrlEncoded(str) {
    return !!str.match(/^[A-Za-z0-9\-_]+={0,2}$/);
}
exports.isBase64UrlEncoded = isBase64UrlEncoded;
//# sourceMappingURL=util.js.map