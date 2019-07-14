import { describe, it } from "mocha";
import { assertionOptions, findAuthr } from "../src/assertion";
import { mockReq } from "sinon-express-mock";
import { expect } from "chai";

describe("assertionOptions()", () => {
  it("should return ok status", async () => {
    const request = {
      body: {
        username: "johndoe@example.com"
      },
      session: {}
    };
    const requestMock = mockReq(request);
    const options = await assertionOptions(requestMock);
    expect(options.status).to.equal("ok");
  });

  it("should return failed status", async () => {
    const request = {};
    const requestMock = mockReq(request);
    try {
      await assertionOptions(requestMock);
    } catch (e) {
      expect(e.message).to.equal("Request missing username field!");
    }
  });
});

describe("findAuhtr()", () => {
  it("should return authr", () => {
    const credID = "credID";
    const authenticators = [
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
    const authr = findAuthr(credID, authenticators);
    expect(authr.fmt).to.equal("packed");
    expect(authr.publicKey).to.equal("publicKey");
    expect(authr.counter).to.equal(100);
    expect(authr.credID).to.equal(credID);
  });

  it("should return 'Error'", () => {
    const credID = "test";
    const authenticators = [
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
    let authr;
    try {
      authr = findAuthr(credID, authenticators);
    } catch (e) {
      expect(e.message).to.equal(`Unknown authenticator with credID ${credID}`);
    }
    expect(authr).to.equal(undefined);
  });
});
