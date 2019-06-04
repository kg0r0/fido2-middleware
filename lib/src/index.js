"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var config_1 = __importDefault(require("config"));
var db_1 = require("./db");
var fido2lib = require("fido2-lib");
var str2ab = require("string-to-arraybuffer");
var fido2MiddlewareConfig = config_1.default.get("fido2-middlewareConfig");
function isRequestBody(bodyObject) {
    return (bodyObject.id != null &&
        bodyObject.rawId != null &&
        bodyObject.response != null &&
        bodyObject.type != null);
}
function preFormatResultReq(reqBody) {
    reqBody.id = str2ab(reqBody.id);
    reqBody.rawId = str2ab(reqBody.rawId);
    return reqBody;
}
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
function attestationOptions(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var excludeCredentials, fido2Lib, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.username || !req.body.displayName) {
                        return [2 /*return*/, res.json({
                                status: "failed",
                                errorMessage: "Request missing display name or username field!"
                            })];
                    }
                    if (!fido2MiddlewareConfig.db) {
                        if (db_1.database[req.body.username] && db_1.database[req.body.username].registered) {
                            excludeCredentials = [
                                {
                                    type: "public-key",
                                    id: db_1.database[req.body.username].authenticatorp[0].credID
                                }
                            ];
                        }
                        else {
                            db_1.database[req.body.username] = {
                                name: req.body.displayName,
                                registerd: false,
                                id: util_1.randomBase64URLBuffer(32),
                                authenticators: []
                            };
                        }
                    }
                    fido2Lib = new fido2lib.Fido2Lib(fido2MiddlewareConfig.fido2lib);
                    return [4 /*yield*/, fido2Lib.attestationOptions().catch(function (err) {
                            return res.json({
                                status: "failed",
                                errorMessage: err.message
                            });
                        })];
                case 1:
                    options = _a.sent();
                    options.status = "ok";
                    options.errorMessage = "";
                    options.extensions = req.body.extensions;
                    options.authenticatorSelection = req.body.authenticatorSelection;
                    options.excludeCredentials = excludeCredentials;
                    options.user.name = req.body.username;
                    options.user.id = util_1.randomBase64URLBuffer(32);
                    options.challenge = util_1.randomBase64URLBuffer(32);
                    options.user.displayName = req.body.displayName;
                    if (req.session) {
                        req.session.challenge = options.challenge;
                        req.session.username = req.body.username;
                    }
                    return [2 /*return*/, res.json(options)];
            }
        });
    });
}
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
function attestationResult(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var fido2Lib, expected, requestBody, result, authrInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(req.body != null && isRequestBody(req.body))) {
                        return [2 /*return*/, res.json({
                                status: "failed",
                                errorMessage: "Response missing one or more of id/rawId/response/type fields"
                            })];
                    }
                    if (req.body.type !== "public-key") {
                        return [2 /*return*/, res.json({
                                status: "failed",
                                errorMessage: "type is not public-key!"
                            })];
                    }
                    if (!util_1.isBase64UrlEncoded(req.body.id)) {
                        return [2 /*return*/, res.json({
                                status: "failed",
                                errorMessage: "Invalid id!"
                            })];
                    }
                    fido2Lib = new fido2lib.Fido2Lib();
                    expected = {
                        challenge: req.session ? req.session.challenge : "",
                        origin: fido2MiddlewareConfig.origin || "localhost",
                        factor: fido2MiddlewareConfig.factor || "either"
                    };
                    requestBody = preFormatResultReq(req.body);
                    return [4 /*yield*/, fido2Lib
                            .attestationResult(requestBody, expected)
                            .catch(function (err) {
                            return res.json({
                                status: "failed",
                                errorMessage: err.message
                            });
                        })];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        return [2 /*return*/, res.json({
                                status: "failed",
                                errorMessage: "Can not authenticate signature!"
                            })];
                    }
                    authrInfo = {
                        fmt: result.authnrData.get("fmt"),
                        publicKey: result.authnrData.get("credentialPublicKeyPem"),
                        counter: result.authnrData.get("counter"),
                        credID: result.authnrData.get("credId")
                    };
                    if (req.session) {
                        db_1.database[req.session.username].authenticators.push(authrInfo);
                        db_1.database[req.session.username].registerd = true;
                    }
                    return [2 /*return*/, res.json({
                            status: "ok",
                            errorMessage: ""
                        })];
            }
        });
    });
}
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
function assertionOptions(req, res, next) {
    next();
}
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
function assertionResult(req, res, next) {
    next();
}
module.exports = {
    attestationOptions: attestationOptions,
    attestationResult: attestationResult,
    assertionOptions: assertionOptions,
    assertionResult: assertionResult
};
//# sourceMappingURL=index.js.map