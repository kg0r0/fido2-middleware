"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var base64url_1 = __importDefault(require("base64url"));
var config_1 = __importDefault(require("config"));
exports.fido2MiddlewareConfig = isConfigFile(process.cwd() + "/config/default.json")
    ? config_1.default.get("fido2-middlewareConfig")
    : {
        db: {},
        factor: "either",
        fido2lib: {
            timeout: 6000,
            rpId: "localhost",
            challengeSize: 32
        },
        origin: "https://localhost:3000",
        attestationOptionsPath: "/attestation/options",
        attestationResultPath: "/attestation/result",
        assertionOptionsPath: "/assertion/options",
        assertionResultPath: "/assertion/result"
    };
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
    return (bodyObject.id != null &&
        bodyObject.rawId != null &&
        bodyObject.response != null &&
        bodyObject.type != null);
}
exports.isRequestBody = isRequestBody;
/**
 *
 * @param {RequestBody} reqBody
 * @returns {RequestBody}
 */
function preFormatAttestationResultReq(reqBody) {
    return {
        id: str2ab(reqBody.id),
        rawId: str2ab(reqBody.rawId),
        response: reqBody.response,
        type: reqBody.type
    };
}
exports.preFormatAttestationResultReq = preFormatAttestationResultReq;
/**
 *
 * @param {RequestBody} reqBody
 * @returns {RequestBody}
 */
function preFormatAssertionResultReq(reqBody) {
    if (reqBody.response.authenticatorData) {
        reqBody.response.authenticatorData = toArrayBuffer(base64url_1.default.toBuffer(reqBody.response.authenticatorData));
    }
    if (reqBody.response.userHandle == null) {
        reqBody.response.userHandle = undefined;
    }
    return {
        id: str2ab(reqBody.id),
        rawId: str2ab(reqBody.rawId),
        response: reqBody.response,
        type: reqBody.type
    };
}
exports.preFormatAssertionResultReq = preFormatAssertionResultReq;
/**
 *
 * @param req
 * @param clientDataJSON
 * @param {}
 */
function assertionClientDataJSONValidator(req, clientDataJSON) {
    if (req.session && clientDataJSON.challenge !== req.session.challenge)
        throw new Error("Challenges don't match!");
    if (clientDataJSON.origin !== exports.fido2MiddlewareConfig.origin)
        throw new Error("Origins don't match!");
    if (clientDataJSON.type !== "webauthn.get")
        throw new Error("Type don't match!");
    if (clientDataJSON.tokenBinding)
        throw new Error("Token Binding don`t support!");
    return true;
}
exports.assertionClientDataJSONValidator = assertionClientDataJSONValidator;
function attestationResultReqValidator(body) {
    if (!(body != null && isRequestBody(body)))
        throw new Error("Response missing one or more of id/rawId/response/type fields");
    if (body.type !== "public-key")
        throw new Error("type is not public-key!");
    if (!isBase64UrlEncoded(body.id))
        throw new Error("Invalid id!");
    return true;
}
exports.attestationResultReqValidator = attestationResultReqValidator;
/**
 *
 * @param body
 * @returns {boolean}
 */
function assertionResultReqValidator(body) {
    if (!(body != null && isRequestBody(body)))
        throw new Error("Response missing one or more of id/rawId/response/type fields");
    if (body.type !== "public-key")
        throw new Error("type is not public-key!");
    if (!isBase64UrlEncoded(body.id))
        throw new Error("Invalid id!");
    if (!body.response.authenticatorData ||
        typeof body.response.authenticatorData !== "string")
        throw new Error("AuthenticatorData is missing");
    if (!isBase64UrlEncoded(body.response.authenticatorData))
        throw new Error("AuthenticatorData is not base64url encoded");
    if (body.response.userHandle && typeof body.response.userHandle !== "string")
        throw new Error("userHandle is not of type DOMString");
    if (typeof body.response.signature !== "string" ||
        !isBase64UrlEncoded(body.response.signature))
        throw new Error("Signature is not base64url encoded");
    return true;
}
exports.assertionResultReqValidator = assertionResultReqValidator;
function isConfigFile(dirname) {
    try {
        fs_1.default.accessSync(dirname, fs_1.default.constants.R_OK);
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.isConfigFile = isConfigFile;
//# sourceMappingURL=util.js.map