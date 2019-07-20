"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var base64url_1 = __importDefault(require("base64url"));
var util_1 = require("../src/util");
var sinon_express_mock_1 = require("sinon-express-mock");
mocha_1.describe("randomBase64URLBuffer()", function () {
    var base64String1 = util_1.randomBase64URLBuffer(10);
    var base64String2 = util_1.randomBase64URLBuffer(10);
    mocha_1.it("is base64", function () {
        return chai_1.expect(util_1.isBase64UrlEncoded(base64String1)).to.equal(true);
    });
    mocha_1.it("is different 1 and 2", function () {
        return chai_1.expect(base64String1).to.not.equal(base64String2);
    });
});
mocha_1.describe("isBase64UrlEncoded()", function () {
    var base64string = base64url_1.default.encode("test string");
    mocha_1.it("should return true", function () {
        return chai_1.expect(util_1.isBase64UrlEncoded(base64string)).to.equal(true);
    });
    mocha_1.it("should return false", function () {
        return chai_1.expect(util_1.isBase64UrlEncoded("test string")).to.equal(false);
    });
});
mocha_1.describe("toArrayBuffer()", function () {
    mocha_1.it("should return ArrayBuffer", function () {
        var buf = Buffer.from("test");
        var arrayBuf = util_1.toArrayBuffer(buf);
        chai_1.expect(Buffer.isBuffer(arrayBuf)).to.equal(false);
        chai_1.expect(arrayBuf instanceof ArrayBuffer).to.equal(true);
    });
});
mocha_1.describe("preformatAttestationResultReq()", function () {
    var reqBody = {
        id: "test id",
        rawId: "test rawId",
        response: {},
        type: "test"
    };
    mocha_1.it("should return ArrayBuffer", function () {
        var body = util_1.preFormatAttestationResultReq(reqBody);
        chai_1.expect(body.id instanceof ArrayBuffer).to.equal(true);
        chai_1.expect(body.rawId instanceof ArrayBuffer).to.equal(true);
    });
});
mocha_1.describe("preformatAssertionResultReq()", function () {
    var reqBody = {
        id: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        rawId: "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        response: {
            authenticatorData: "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MBAAAAAA",
            signature: "MEYCIQCv7EqsBRtf2E4o_BjzZfBwNpP8fLjd5y6TUOLWt5l9DQIhANiYig9newAJZYTzG1i5lwP-YQk9uXFnnDaHnr2yCKXL",
            userHandle: "",
            clientDataJSON: "eyJjaGFsbGVuZ2UiOiJ4ZGowQ0JmWDY5MnFzQVRweTBrTmM4NTMzSmR2ZExVcHFZUDh3RFRYX1pFIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwidHlwZSI6IndlYmF1dGhuLmdldCJ9"
        },
        type: "public-key"
    };
    mocha_1.it("should return ArrayBuffer", function () {
        var body = util_1.preFormatAssertionResultReq(reqBody);
        chai_1.expect(body.id instanceof ArrayBuffer).to.equal(true);
        chai_1.expect(body.rawId instanceof ArrayBuffer).to.equal(true);
        chai_1.expect(body.response.authenticatorData instanceof ArrayBuffer).to.equal(true);
    });
});
mocha_1.describe("isRequestBody()", function () {
    var body = {
        id: "id",
        rawId: "rawId",
        response: {},
        type: "type"
    };
    mocha_1.it("should return true", function () {
        chai_1.expect(util_1.isRequestBody(body)).to.equal(true);
    });
    mocha_1.it("should return false", function () {
        chai_1.expect(util_1.isRequestBody({})).to.equal(false);
    });
});
mocha_1.describe("ClientDataJSONValidater()", function () {
    var request = {
        body: {
            username: "johndoe@example.com",
            displayName: "John Doe"
        },
        session: {
            challenge: "challenge"
        }
    };
    var requestMock = sinon_express_mock_1.mockReq(request);
    mocha_1.it("should return 'ok'", function () {
        var clinetDataJSON = {
            challenge: "challenge",
            origin: "https://localhost:3000",
            type: "webauthn.get",
            tokenBinding: ""
        };
        var result = util_1.assertionClientDataJSONValidator(requestMock, clinetDataJSON);
        chai_1.expect(result).to.equal(true);
    });
    mocha_1.it("should return 'Challenges don't match!'", function () {
        var clinetDataJSON = {
            challenge: "dummy",
            origin: "http://localhost:3000",
            type: "webauthn.get",
            tokenBinding: ""
        };
        try {
            util_1.assertionClientDataJSONValidator(requestMock, clinetDataJSON);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("Challenges don't match!");
        }
    });
    mocha_1.it("should return 'Origins don't match!'", function () {
        var clinetDataJSON = {
            challenge: "challenge",
            origin: "dummy",
            type: "webauthn.get",
            tokenBinding: ""
        };
        try {
            util_1.assertionClientDataJSONValidator(requestMock, clinetDataJSON);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("Origins don't match!");
        }
    });
    mocha_1.it("should return 'Type don't match!'", function () {
        var clinetDataJSON = {
            challenge: "challenge",
            origin: "https://localhost:3000",
            type: "webauthn.create",
            tokenBinding: ""
        };
        try {
            util_1.assertionClientDataJSONValidator(requestMock, clinetDataJSON);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("Type don't match!");
        }
    });
    mocha_1.it("should return 'Token Binding don`t support!'", function () {
        var clinetDataJSON = {
            challenge: "challenge",
            origin: "https://localhost:3000",
            type: "webauthn.get",
            tokenBinding: "tokenBinding"
        };
        try {
            util_1.assertionClientDataJSONValidator(requestMock, clinetDataJSON);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("Token Binding don`t support!");
        }
    });
});
mocha_1.describe("attestationResultReqValidator()", function () {
    mocha_1.it("should return true", function () {
        var body = {
            id: "id",
            rawId: "rawId",
            response: {},
            type: "public-key"
        };
        chai_1.expect(util_1.attestationResultReqValidator(body)).to.equal(true);
    });
    mocha_1.it("should return 'Response missing one or more of id/rawId/response/type fields'", function () {
        var body = {};
        try {
            util_1.attestationResultReqValidator(body);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("Response missing one or more of id/rawId/response/type fields");
        }
    });
    mocha_1.it("should return 'type is not public-key!'", function () {
        var body = {
            id: "id",
            rawId: "rawId",
            response: {},
            type: "type"
        };
        try {
            util_1.attestationResultReqValidator(body);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("type is not public-key!");
        }
    });
    mocha_1.it("should return 'Invalid id!'", function () {
        var body = {
            id: "+/=",
            rawId: "rawId",
            response: {},
            type: "public-key"
        };
        try {
            util_1.attestationResultReqValidator(body);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("Invalid id!");
        }
    });
});
mocha_1.describe("assertionResultReqValidator()", function () {
    mocha_1.it("should return true", function () {
        var body = {
            id: "id",
            rawId: "rawId",
            response: {
                authenticatorData: "authenticatorData",
                userHandle: "userHandle",
                signature: "signature"
            },
            type: "public-key"
        };
        chai_1.expect(util_1.assertionResultReqValidator(body)).to.equal(true);
    });
    mocha_1.it("should return 'Response missing one or more of id/rawId/response/type fields'", function () {
        var body = {};
        try {
            util_1.assertionResultReqValidator(body);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("Response missing one or more of id/rawId/response/type fields");
        }
    });
    mocha_1.it("should return 'type is not public-key!'", function () {
        var body = {
            id: "id",
            rawId: "rawId",
            response: {},
            type: "type"
        };
        try {
            util_1.assertionResultReqValidator(body);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("type is not public-key!");
        }
    });
    mocha_1.it("should return 'Invalid id!'", function () {
        var body = {
            id: "+/=",
            rawId: "rawId",
            response: {},
            type: "public-key"
        };
        try {
            util_1.assertionResultReqValidator(body);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("Invalid id!");
        }
    });
    mocha_1.it("should return 'AuthenticatorData is missing'", function () {
        var body = {
            id: "id",
            rawId: "rawId",
            response: {},
            type: "public-key"
        };
        try {
            util_1.assertionResultReqValidator(body);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("AuthenticatorData is missing");
        }
    });
    mocha_1.it("should return 'AuthenticatorData is not base64url encoded'", function () {
        var body = {
            id: "id",
            rawId: "rawId",
            response: {
                authenticatorData: "+/="
            },
            type: "public-key"
        };
        try {
            util_1.assertionResultReqValidator(body);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("AuthenticatorData is not base64url encoded");
        }
    });
    mocha_1.it("should return 'userHandle is not of type DOMString'", function () {
        var body = {
            id: "id",
            rawId: "rawId",
            response: {
                authenticatorData: "authenticatorData",
                userHandle: 100
            },
            type: "public-key"
        };
        try {
            util_1.assertionResultReqValidator(body);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("userHandle is not of type DOMString");
        }
    });
    mocha_1.it("should return 'Signature is not base64url encoded'", function () {
        var body = {
            id: "id",
            rawId: "rawId",
            response: {
                authenticatorData: "authenticatorData",
                userHandle: "userHandle",
                signature: "+/="
            },
            type: "public-key"
        };
        try {
            util_1.assertionResultReqValidator(body);
        }
        catch (e) {
            chai_1.expect(e.message).to.equal("Signature is not base64url encoded");
        }
    });
});
//# sourceMappingURL=util.test.js.map