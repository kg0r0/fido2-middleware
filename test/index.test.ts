import { describe, it } from "mocha";

const index = require("../src/index");
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

describe("attestationOptions()", () => {
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

  it("should return 404", done => {
    request(app)
      .post("/")
      .expect(404, done);
  });

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
