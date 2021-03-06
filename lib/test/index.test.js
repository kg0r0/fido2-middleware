"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var index = require("../src/index");
var request = require("supertest");
var express = require("express");
var bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
var cookieParser = require("cookie-parser");
var crypto = require("crypto");
var app = express();
app.use(bodyParser.json());
app.use(cookieSession({
    name: "session",
    keys: [crypto.randomBytes(32).toString("hex")],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(cookieParser());
app.use("/", index.webAuthentication);
mocha_1.describe("webAuthentication()", function () {
    mocha_1.it("should return 404", function (done) {
        request(app)
            .post("/")
            .expect(404, done);
    });
});
mocha_1.describe("webAuthentication.attestationOptions()", function () {
    mocha_1.it("should return ok status", function (done) {
        request(app)
            .post("/attestation/options")
            .send({ username: "johndoe@example.com", displayName: "John Doe" })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
    mocha_1.it("should return failed status", function (done) {
        request(app)
            .post("/attestation/options")
            .send({})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, '{"status":"failed","errorMessage":"Request missing display name or username field!"}', done);
    });
});
mocha_1.describe("webAuthentication.attestationResult()", function () {
    mocha_1.it("should return failed status", function (done) {
        request(app)
            .post("/attestation/result")
            .send({})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, '{"status":"failed","errorMessage":"Response missing one or more of id/rawId/response/type fields"}', done);
    });
});
mocha_1.describe("webAuthentication.assertionOptions()", function () {
    mocha_1.it("should return ok status", function (done) {
        request(app)
            .post("/assertion/options")
            .send({ username: "johndoe@example.com" })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
    mocha_1.it("should return failed status", function (done) {
        request(app)
            .post("/assertion/options")
            .send({})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, '{"status":"failed","errorMessage":"Request missing username field!"}', done);
    });
});
mocha_1.describe("webAuthentication.assertionResult()", function () {
    mocha_1.it("should return failed status", function (done) {
        request(app)
            .post("/assertion/result")
            .send({})
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, '{"status":"failed","errorMessage":"Response missing one or more of id/rawId/response/type fields"}', done);
    });
});
//# sourceMappingURL=index.test.js.map