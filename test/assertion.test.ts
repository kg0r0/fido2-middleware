import { describe, it } from "mocha";
import { assertionOptions, assertionResult, findAuthr } from "../src/assertion";
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

describe("assertionResult()", () => {
  it("should return 'Response missing one or more of id/rawId/response/type fields'", async () => {
    const request = {};
    const requestMock = mockReq(request);
    try {
      await assertionResult(requestMock);
    } catch (e) {
      expect(e.message).to.equal(
        "Response missing one or more of id/rawId/response/type fields"
      );
    }
  });

  it("should return 'type is not public-key!'", async () => {
    const request = {
      body: {
        id:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        rawId:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        response: {},
        type: "test"
      }
    };
    const requestMock = mockReq(request);
    try {
      await assertionResult(requestMock);
    } catch (e) {
      expect(e.message).to.equal("type is not public-key!");
    }
  });

  it("should return 'AuthenticatorData is missing'", async () => {
    const request = {
      body: {
        id:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        rawId:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        response: {},
        type: "public-key"
      }
    };
    const requestMock = mockReq(request);
    try {
      await assertionResult(requestMock);
    } catch (e) {
      expect(e.message).to.equal("AuthenticatorData is missing");
    }
  });

  it("should return 'Challenges don't match!'", async () => {
    const request = {
      body: {
        id:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        rawId:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        response: {
          authenticatorData:
            "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MBAAAAAA",
          signature:
            "MEYCIQCv7EqsBRtf2E4o_BjzZfBwNpP8fLjd5y6TUOLWt5l9DQIhANiYig9newAJZYTzG1i5lwP-YQk9uXFnnDaHnr2yCKXL",
          userHandle: "",
          clientDataJSON:
            "eyJjaGFsbGVuZ2UiOiJ4ZGowQ0JmWDY5MnFzQVRweTBrTmM4NTMzSmR2ZExVcHFZUDh3RFRYX1pFIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwidHlwZSI6IndlYmF1dGhuLmdldCJ9"
        },
        type: "public-key"
      }
    };
    const requestMock = mockReq(request);
    try {
      await assertionResult(requestMock);
    } catch (e) {
      expect(e.message).to.equal("Challenges don't match!");
    }
  });

  it("should return 'Origins don't match!'", async () => {
    const request = {
      session: {
        challenge: "xdj0CBfX692qsATpy0kNc8533JdvdLUpqYP8wDTX_ZE"
      },
      body: {
        id:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        rawId:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        response: {
          authenticatorData:
            "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MBAAAAAA",
          signature:
            "MEYCIQCv7EqsBRtf2E4o_BjzZfBwNpP8fLjd5y6TUOLWt5l9DQIhANiYig9newAJZYTzG1i5lwP-YQk9uXFnnDaHnr2yCKXL",
          userHandle: "",
          clientDataJSON:
            "eyJjaGFsbGVuZ2UiOiJ4ZGowQ0JmWDY5MnFzQVRweTBrTmM4NTMzSmR2ZExVcHFZUDh3RFRYX1pFIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwidHlwZSI6IndlYmF1dGhuLmdldCJ9"
        },
        type: "public-key"
      }
    };
    const requestMock = mockReq(request);
    try {
      await assertionResult(requestMock);
    } catch (e) {
      expect(e.message).to.equal("Origins don't match!");
    }
  });

  it("should return 'Cannot read property 'authenticators' of undefined'", async () => {
    const request = {
      session: {
        challenge: "xdj0CBfX692qsATpy0kNc8533JdvdLUpqYP8wDTX_ZE",
        username: "johndoe@example.com"
      },
      body: {
        id:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        rawId:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        response: {
          authenticatorData:
            "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MBAAAAAA",
          signature:
            "MEYCIQCv7EqsBRtf2E4o_BjzZfBwNpP8fLjd5y6TUOLWt5l9DQIhANiYig9newAJZYTzG1i5lwP-YQk9uXFnnDaHnr2yCKXL",
          userHandle: "",
          clientDataJSON:
            "eyJjaGFsbGVuZ2UiOiJ4ZGowQ0JmWDY5MnFzQVRweTBrTmM4NTMzSmR2ZExVcHFZUDh3RFRYX1pFIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6MzAwMCIsInR5cGUiOiJ3ZWJhdXRobi5nZXQiLCJhbGciOiJIUzI1NiJ9"
        },
        type: "public-key"
      }
    };
    const requestMock = mockReq(request);
    try {
      await assertionResult(requestMock);
    } catch (e) {
      expect(e.message).to.equal(
        "Cannot read property 'authenticators' of undefined"
      );
    }
  });

  it("should return 'Cannot read property 'authenticators' of undefined'", async () => {
    const request = {
      session: {
        challenge: "xdj0CBfX692qsATpy0kNc8533JdvdLUpqYP8wDTX_ZE",
        username: "johndoe@example.com"
      },
      body: {
        id:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        rawId:
          "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
        response: {
          authenticatorData:
            "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MBAAAAAA",
          signature:
            "MEYCIQCv7EqsBRtf2E4o_BjzZfBwNpP8fLjd5y6TUOLWt5l9DQIhANiYig9newAJZYTzG1i5lwP-YQk9uXFnnDaHnr2yCKXL",
          userHandle: "",
          clientDataJSON:
            "eyJjaGFsbGVuZ2UiOiJ4ZGowQ0JmWDY5MnFzQVRweTBrTmM4NTMzSmR2ZExVcHFZUDh3RFRYX1pFIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6MzAwMCIsInR5cGUiOiJ3ZWJhdXRobi5nZXQiLCJhbGciOiJIUzI1NiJ9"
        },
        type: "public-key"
      }
    };
    const requestMock = mockReq(request);
    try {
      await assertionResult(requestMock);
    } catch (e) {
      expect(e.message).to.equal(
        "Cannot read property 'authenticators' of undefined"
      );
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
