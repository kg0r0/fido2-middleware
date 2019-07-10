"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var base64url_1 = __importDefault(require("base64url"));
var str2ab = require("string-to-arraybuffer");
/**
 *
 * @param {Number} len
 * @returns {String}
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
/**
 *
 * @param {Buffer} buf
 * @returns {ArrayBuffer}
 */
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}
exports.toArrayBuffer = toArrayBuffer;
/**
 * Takes object and tires to verify request body.
 * @param {Object} bodyObject
 * @returns {Boolean}
 */
function isRequestBody(bodyObject) {
    return (bodyObject.id && bodyObject.rawId && bodyObject.response && bodyObject.type);
}
exports.isRequestBody = isRequestBody;
function preFormatResultReq(reqBody) {
    if (reqBody.response.authenticatorData) {
        reqBody.response.authenticatorData = toArrayBuffer(base64url_1.default.toBuffer(reqBody.response.authenticatorData));
    }
    reqBody.id = str2ab(reqBody.id);
    reqBody.rawId = str2ab(reqBody.rawId);
    return reqBody;
}
exports.preFormatResultReq = preFormatResultReq;
//# sourceMappingURL=util.js.map