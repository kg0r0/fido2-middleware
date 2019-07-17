import { describe, it } from "mocha";

const index = require("../src/index");
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const app = express();
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "session",
    keys: [crypto.randomBytes(32).toString("hex")],

    maxAge: 24 * 60 * 60 * 1000
  })
);

app.use(cookieParser());

app.use("/", index.webAuthentication);

describe("webAuthentication()", () => {
  it("should return 404", done => {
    request(app)
      .post("/")
      .expect(404, done);
  });
});

describe("webAuthentication.attestationOptions()", () => {
  it("should return ok status", done => {
    request(app)
      .post("/attestation/options")
      .send({ username: "johndoe@example.com", displayName: "John Doe" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("should return failed status", done => {
    request(app)
      .post("/attestation/options")
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        '{"status":"failed","errorMessage":"Request missing display name or username field!"}',
        done
      );
  });
});

describe("webAuthentication.attestationResult()", () => {
  it("should return failed status", done => {
    request(app)
      .post("/attestation/result")
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        '{"status":"failed","errorMessage":"Response missing one or more of id/rawId/response/type fields"}',
        done
      );
  });
});

describe("webAuthentication.assertionOptions()", () => {
  it("should return ok status", done => {
    request(app)
      .post("/assertion/options")
      .send({ username: "johndoe@example.com" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("should return failed status", done => {
    request(app)
      .post("/assertion/options")
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        '{"status":"failed","errorMessage":"Request missing username field!"}',
        done
      );
  });
});

describe("webAuthentication.assertionResult()", () => {
  it("should return failed status", done => {
    request(app)
      .post("/assertion/result")
      .send({})
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        '{"status":"failed","errorMessage":"Response missing one or more of id/rawId/response/type fields"}',
        done
      );
  });
});
