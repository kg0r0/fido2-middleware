import { describe, it } from "mocha";
import { expect } from "chai";
import base64url from "base64url";
import { isBase64UrlEncoded, randomBase64URLBuffer, toArrayBuffer, preFormatAttestationResultReq, preFormatAssertionResultReq, isRequestBody, assertionClientDataJSONValidater } from "../src/util";
import { mockReq } from "sinon-express-mock";

describe("randomBase64URLBuffer()", () => {
  const base64String1 = randomBase64URLBuffer(10);
  const base64String2 = randomBase64URLBuffer(10);
  it("is base64", () =>
    expect(isBase64UrlEncoded(base64String1)).to.equal(true));
  it("is different 1 and 2", () =>
    expect(base64String1).to.not.equal(base64String2));
});

describe("isBase64UrlEncoded()", () => {
  const base64string: string = base64url.encode("test string");
  it("should return true", () =>
    expect(isBase64UrlEncoded(base64string)).to.equal(true));

  it("should return false", () =>
    expect(isBase64UrlEncoded("test string")).to.equal(false));
});

describe("toArrayBuffer()", () => {
  it("should return ArrayBuffer", () => {
    const buf = Buffer.from("test")
    const arrayBuf = toArrayBuffer(buf);
    expect(Buffer.isBuffer(arrayBuf)).to.equal(false);
    expect(arrayBuf instanceof ArrayBuffer).to.equal(true);
  })
})

describe("preformatAttestationResultReq()", () => {
  const reqBody = {
    id: "test id",
    rawId: "test rawId",
    response: {},
    type: "test"
  }
  it("should return ArrayBuffer", () => {
    const body = preFormatAttestationResultReq(reqBody);
    expect(body.id instanceof ArrayBuffer).to.equal(true);
    expect(body.rawId instanceof ArrayBuffer).to.equal(true);
  })
})

describe("preformatAssertionResultReq()", () => {
  const reqBody = {
    id: "test id",
    rawId: "test rawId",
    response: {},
    type: "test"
  }
  it("should return ArrayBuffer", () => {
    const body = preFormatAssertionResultReq(reqBody);
    expect(body.id instanceof ArrayBuffer).to.equal(true);
    expect(body.rawId instanceof ArrayBuffer).to.equal(true);
  })

  describe("isRequestBody()", () => {
    const body = {
      id: "id",
      rawId: "rawId",
      response: {},
      type: "type"
    }
    it("should return true", () => {
      expect(isRequestBody(body)).to.equal(true);
    })

    it("should return false", () => {
      expect(isRequestBody({})).to.equal(false);
    })


  })

  describe("ClientDataJSONValidater()", () => {
    const request = {
      body: {
        username: "johndoe@example.com",
        displayName: "John Doe"
      },
      session: {
        challenge: "challenge"
      }
    };
    const requestMock = mockReq(request);

    it("should return 'ok'", () => {
      const clinetDataJSON = {
        challenge: "challenge",
        origin: "https://localhost:3000",
        type: "webauthn.get",
        tokenBinding: "",
      }
      const result = assertionClientDataJSONValidater(requestMock, clinetDataJSON)
      expect(result.status).to.equal("ok");
      expect(result.errorMessage).to.equal("");
    })

    it("should return 'Challenges don't match!'", () => {
      const clinetDataJSON = {
        challenge: "dummy",
        origin: "http://localhost:3000",
        type: "webauthn.get",
        tokenBinding: "",
      }
      const result = assertionClientDataJSONValidater(requestMock, clinetDataJSON)
      expect(result.status).to.equal("failed");
      expect(result.errorMessage).to.equal("Challenges don't match!");
    })

    it("should return 'Origins don't match!'", () => {
      const clinetDataJSON = {
        challenge: "challenge",
        origin: "dummy",
        type: "webauthn.get",
        tokenBinding: "",
      }
      const result = assertionClientDataJSONValidater(requestMock, clinetDataJSON)
      expect(result.status).to.equal("failed");
      expect(result.errorMessage).to.equal("Origins don't match!");
    })

    it("should return 'Type don't match!'", () => {
      const clinetDataJSON = {
        challenge: "challenge",
        origin: "https://localhost:3000",
        type: "webauthn.create",
        tokenBinding: "",
      }
      const result = assertionClientDataJSONValidater(requestMock, clinetDataJSON)
      expect(result.status).to.equal("failed");
      expect(result.errorMessage).to.equal("Type don't match!");
    })

    it("should return 'Token Binding don`t support!'", () => {
      const clinetDataJSON = {
        challenge: "challenge",
        origin: "https://localhost:3000",
        type: "webauthn.get",
        tokenBinding: "tokenBinding",
      }
      const result = assertionClientDataJSONValidater(requestMock, clinetDataJSON)
      expect(result.status).to.equal("failed");
      expect(result.errorMessage).to.equal("Token Binding don`t support!");
    })
  })
})