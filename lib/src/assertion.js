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
var base64url_1 = __importDefault(require("base64url"));
var fido2lib = require("fido2-lib");
var cache = require("./cache");
function findAuthr(credID, authenticators) {
    for (var _i = 0, authenticators_1 = authenticators; _i < authenticators_1.length; _i++) {
        var authr = authenticators_1[_i];
        if (authr.credID === credID)
            return authr;
    }
    throw new Error("Unknown authenticator with credID " + credID);
}
exports.findAuthr = findAuthr;
/**
 *
 * @param {Object} req - Express request object
 * @returns {undefined}
 */
function assertionOptions(req) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheData, authenticators, allowCredentials, _i, authenticators_2, authr, serve, result, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.username)
                        throw new Error("Request missing username field!");
                    return [4 /*yield*/, cache.getAsync(req.body.username)];
                case 1:
                    cacheData = _a.sent();
                    authenticators = cacheData ? cacheData.authenticators : [];
                    allowCredentials = [];
                    for (_i = 0, authenticators_2 = authenticators; _i < authenticators_2.length; _i++) {
                        authr = authenticators_2[_i];
                        allowCredentials.push({
                            type: "public-key",
                            id: authr.credID
                        });
                    }
                    serve = new fido2lib.Fido2Lib();
                    return [4 /*yield*/, serve.assertionOptions()];
                case 2:
                    result = _a.sent();
                    options = {
                        challenge: util_1.randomBase64URLBuffer(32),
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
                    return [2 /*return*/, options];
            }
        });
    });
}
exports.assertionOptions = assertionOptions;
/**
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
function assertionResult(req) {
    return __awaiter(this, void 0, void 0, function () {
        var clientData, authenticators, factor, cacheData, authr, fido2Lib, expected, requestBody, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    util_1.assertionResultReqValidator(req.body);
                    clientData = JSON.parse(base64url_1.default.decode(req.body.response.clientDataJSON));
                    util_1.assertionClientDataJSONValidator(req, clientData);
                    if (!req.session) return [3 /*break*/, 2];
                    return [4 /*yield*/, cache.getAsync(req.session.username)];
                case 1:
                    cacheData = _a.sent();
                    authenticators = cacheData.authenticators;
                    factor = req.session.userVerification === "required" ? "first" : "either";
                    _a.label = 2;
                case 2:
                    authr = findAuthr(req.body.id, authenticators);
                    fido2Lib = new fido2lib.Fido2Lib();
                    expected = {
                        challenge: clientData.challenge,
                        origin: util_1.fido2MiddlewareConfig.origin,
                        factor: factor || util_1.fido2MiddlewareConfig.factor,
                        publicKey: authr.publicKey,
                        prevCounter: authr.counter,
                        userHandle: req.body.response.userHandle || null
                    };
                    requestBody = util_1.preFormatAssertionResultReq(req.body);
                    return [4 /*yield*/, fido2Lib
                            .assertionResult(requestBody, expected)
                            .catch(function (err) {
                            return {
                                status: "failed",
                                errorMessage: err.message
                            };
                        })];
                case 3:
                    result = _a.sent();
                    if (req.session && !result.status) {
                        req.session.loggedIn = true;
                    }
                    return [2 /*return*/, {
                            status: result.status || "ok",
                            errorMessage: result.errorMessage || ""
                        }];
            }
        });
    });
}
exports.assertionResult = assertionResult;
//# sourceMappingURL=assertion.js.map