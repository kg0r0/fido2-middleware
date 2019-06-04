"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var base64url_1 = __importDefault(require("base64url"));
var util_1 = require("../src/util");
mocha_1.describe("randomBase64URLBuffer()", function () {
    var base64String1 = util_1.randomBase64URLBuffer(10);
    var base64String2 = util_1.randomBase64URLBuffer(10);
    mocha_1.it("is length ok", function () {
        return chai_1.expect(base64url_1.default.decode(base64String1).length).to.equal(10);
    });
    mocha_1.it("is base64", function () {
        return chai_1.expect(util_1.isBase64UrlEncoded(base64String1)).to.equal(true);
    });
    mocha_1.it("is different 1 and 2", function () {
        return chai_1.expect(base64String1).to.not.equal(base64String2);
    });
});
mocha_1.describe("isBase64UrlEncoded()", function () {
    var base64string = base64url_1.default.encode("test string");
    mocha_1.it("should return ok status", function () {
        return chai_1.expect(util_1.isBase64UrlEncoded(base64string)).to.equal(true);
    });
});
//# sourceMappingURL=util.test.js.map