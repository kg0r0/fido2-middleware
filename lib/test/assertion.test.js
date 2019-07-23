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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assertion_1 = require("../src/assertion");
var sinon_express_mock_1 = require("sinon-express-mock");
var chai_1 = require("chai");
mocha_1.describe("assertionOptions()", function () {
    mocha_1.it("should return ok status", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, requestMock, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        body: {
                            username: "johndoe@example.com"
                        },
                        session: {}
                    };
                    requestMock = sinon_express_mock_1.mockReq(request);
                    return [4 /*yield*/, assertion_1.assertionOptions(requestMock)];
                case 1:
                    options = _a.sent();
                    chai_1.expect(options.status).to.equal("ok");
                    return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it("should return failed status", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, requestMock, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {};
                    requestMock = sinon_express_mock_1.mockReq(request);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, assertion_1.assertionOptions(requestMock)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    chai_1.expect(e_1.message).to.equal("Request missing username field!");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
mocha_1.describe("assertionResult()", function () {
    mocha_1.it("should return 'Response missing one or more of id/rawId/response/type fields'", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, requestMock, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {};
                    requestMock = sinon_express_mock_1.mockReq(request);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, assertion_1.assertionResult(requestMock)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    chai_1.expect(e_2.message).to.equal("Response missing one or more of id/rawId/response/type fields");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it("should return 'type is not public-key!'", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, requestMock, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        body: {
                            id: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            rawId: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            response: {},
                            type: "test"
                        }
                    };
                    requestMock = sinon_express_mock_1.mockReq(request);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, assertion_1.assertionResult(requestMock)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    chai_1.expect(e_3.message).to.equal("type is not public-key!");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it("should return 'AuthenticatorData is missing'", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, requestMock, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        body: {
                            id: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            rawId: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            response: {},
                            type: "public-key"
                        }
                    };
                    requestMock = sinon_express_mock_1.mockReq(request);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, assertion_1.assertionResult(requestMock)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    chai_1.expect(e_4.message).to.equal("AuthenticatorData is missing");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it("should return 'Challenges don't match!'", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, requestMock, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        body: {
                            id: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            rawId: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            response: {
                                authenticatorData: "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MBAAAAAA",
                                signature: "MEYCIQCv7EqsBRtf2E4o_BjzZfBwNpP8fLjd5y6TUOLWt5l9DQIhANiYig9newAJZYTzG1i5lwP-YQk9uXFnnDaHnr2yCKXL",
                                userHandle: "",
                                clientDataJSON: "eyJjaGFsbGVuZ2UiOiJ4ZGowQ0JmWDY5MnFzQVRweTBrTmM4NTMzSmR2ZExVcHFZUDh3RFRYX1pFIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwidHlwZSI6IndlYmF1dGhuLmdldCJ9"
                            },
                            type: "public-key"
                        }
                    };
                    requestMock = sinon_express_mock_1.mockReq(request);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, assertion_1.assertionResult(requestMock)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_5 = _a.sent();
                    chai_1.expect(e_5.message).to.equal("Challenges don't match!");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it("should return 'Origins don't match!'", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, requestMock, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        session: {
                            challenge: "xdj0CBfX692qsATpy0kNc8533JdvdLUpqYP8wDTX_ZE"
                        },
                        body: {
                            id: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            rawId: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            response: {
                                authenticatorData: "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MBAAAAAA",
                                signature: "MEYCIQCv7EqsBRtf2E4o_BjzZfBwNpP8fLjd5y6TUOLWt5l9DQIhANiYig9newAJZYTzG1i5lwP-YQk9uXFnnDaHnr2yCKXL",
                                userHandle: "",
                                clientDataJSON: "eyJjaGFsbGVuZ2UiOiJ4ZGowQ0JmWDY5MnFzQVRweTBrTmM4NTMzSmR2ZExVcHFZUDh3RFRYX1pFIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwidHlwZSI6IndlYmF1dGhuLmdldCJ9"
                            },
                            type: "public-key"
                        }
                    };
                    requestMock = sinon_express_mock_1.mockReq(request);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, assertion_1.assertionResult(requestMock)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_6 = _a.sent();
                    chai_1.expect(e_6.message).to.equal("Origins don't match!");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it("should return 'Cannot read property 'authenticators' of undefined'", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, requestMock, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        session: {
                            challenge: "xdj0CBfX692qsATpy0kNc8533JdvdLUpqYP8wDTX_ZE",
                            username: "johndoe@example.com"
                        },
                        body: {
                            id: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            rawId: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            response: {
                                authenticatorData: "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MBAAAAAA",
                                signature: "MEYCIQCv7EqsBRtf2E4o_BjzZfBwNpP8fLjd5y6TUOLWt5l9DQIhANiYig9newAJZYTzG1i5lwP-YQk9uXFnnDaHnr2yCKXL",
                                userHandle: "",
                                clientDataJSON: "eyJjaGFsbGVuZ2UiOiJ4ZGowQ0JmWDY5MnFzQVRweTBrTmM4NTMzSmR2ZExVcHFZUDh3RFRYX1pFIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6MzAwMCIsInR5cGUiOiJ3ZWJhdXRobi5nZXQiLCJhbGciOiJIUzI1NiJ9"
                            },
                            type: "public-key"
                        }
                    };
                    requestMock = sinon_express_mock_1.mockReq(request);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, assertion_1.assertionResult(requestMock)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_7 = _a.sent();
                    chai_1.expect(e_7.message).to.equal("Cannot read property 'authenticators' of undefined");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it("should return 'Cannot read property 'authenticators' of undefined'", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, requestMock, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        session: {
                            challenge: "xdj0CBfX692qsATpy0kNc8533JdvdLUpqYP8wDTX_ZE",
                            username: "johndoe@example.com"
                        },
                        body: {
                            id: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            rawId: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
                            response: {
                                authenticatorData: "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MBAAAAAA",
                                signature: "MEYCIQCv7EqsBRtf2E4o_BjzZfBwNpP8fLjd5y6TUOLWt5l9DQIhANiYig9newAJZYTzG1i5lwP-YQk9uXFnnDaHnr2yCKXL",
                                userHandle: "",
                                clientDataJSON: "eyJjaGFsbGVuZ2UiOiJ4ZGowQ0JmWDY5MnFzQVRweTBrTmM4NTMzSmR2ZExVcHFZUDh3RFRYX1pFIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6MzAwMCIsInR5cGUiOiJ3ZWJhdXRobi5nZXQiLCJhbGciOiJIUzI1NiJ9"
                            },
                            type: "public-key"
                        }
                    };
                    requestMock = sinon_express_mock_1.mockReq(request);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, assertion_1.assertionResult(requestMock)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_8 = _a.sent();
                    chai_1.expect(e_8.message).to.equal("Cannot read property 'authenticators' of undefined");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
mocha_1.describe("findAuhtr()", function () {
    mocha_1.it("should return authr", function () {
        var credID = "credID";
        var authenticators = [
            {
                fmt: "packed",
                publicKey: "publicKey",
                counter: 100,
                credID: "credID"
            },
            {
                fmt: "dummy",
                publicKey: "dummy",
                counter: 0,
                credID: "dummy"
            }
        ];
        var authr = assertion_1.findAuthr(credID, authenticators);
        chai_1.expect(authr.fmt).to.equal("packed");
        chai_1.expect(authr.publicKey).to.equal("publicKey");
        chai_1.expect(authr.counter).to.equal(100);
        chai_1.expect(authr.credID).to.equal(credID);
    });
    mocha_1.it("should return 'Error'", function () {
        var credID = "test";
        var authenticators = [
            {
                fmt: "packed",
                publicKey: "publicKey",
                counter: 100,
                credID: "credID"
            },
            {
                fmt: "dummy",
                publicKey: "dummy",
                counter: 0,
                credID: "dummy"
            }
        ];
        var authr;
        try {
            authr = assertion_1.findAuthr(credID, authenticators);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("Unknown authenticator with credID " + credID);
        }
        chai_1.expect(authr).to.equal(undefined);
    });
});
//# sourceMappingURL=assertion.test.js.map