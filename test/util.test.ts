import { describe, it } from "mocha";
import { expect } from "chai";
import base64url from "base64url";
import {
  isBase64UrlEncoded,
  randomBase64URLBuffer,
  toArrayBuffer,
  preFormatAttestationResultReq,
  preFormatAssertionResultReq,
  isRequestBody,
  assertionClientDataJSONValidator,
  attestationResultReqValidator,
  assertionResultReqValidator
} from "../src/util";
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
    const buf = Buffer.from("test");
    const arrayBuf = toArrayBuffer(buf);
    expect(Buffer.isBuffer(arrayBuf)).to.equal(false);
    expect(arrayBuf instanceof ArrayBuffer).to.equal(true);
  });
});

describe("preformatAttestationResultReq()", () => {
  const reqBody = {
    id: "test id",
    rawId: "test rawId",
    response: {},
    type: "test"
  };
  it("should return ArrayBuffer", () => {
    const body = preFormatAttestationResultReq(reqBody);
    expect(body.id instanceof ArrayBuffer).to.equal(true);
    expect(body.rawId instanceof ArrayBuffer).to.equal(true);
  });
});

describe("preformatAssertionResultReq()", () => {
  const reqBody = {
    id:
      "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
    rawId:
      "LFdoCFJTyB82ZzSJUHc-c72yraRc_1mPvGX8ToE8su39xX26Jcqd31LUkKOS36FIAWgWl6itMKqmDvruha6ywA",
    response: {
      authenticatorData: "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MBAAAAAA",
      signature:
        "MEYCIQCv7EqsBRtf2E4o_BjzZfBwNpP8fLjd5y6TUOLWt5l9DQIhANiYig9newAJZYTzG1i5lwP-YQk9uXFnnDaHnr2yCKXL",
      userHandle: "",
      clientDataJSON:
        "eyJjaGFsbGVuZ2UiOiJ4ZGowQ0JmWDY5MnFzQVRweTBrTmM4NTMzSmR2ZExVcHFZUDh3RFRYX1pFIiwiY2xpZW50RXh0ZW5zaW9ucyI6e30sImhhc2hBbGdvcml0aG0iOiJTSEEtMjU2Iiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwidHlwZSI6IndlYmF1dGhuLmdldCJ9"
    },
    type: "public-key"
  };
  it("should return ArrayBuffer", () => {
    const body = preFormatAssertionResultReq(reqBody);
    expect(body.id instanceof ArrayBuffer).to.equal(true);
    expect(body.rawId instanceof ArrayBuffer).to.equal(true);
    expect(body.response.authenticatorData instanceof ArrayBuffer).to.equal(
      true
    );
  });
});

describe("isRequestBody()", () => {
  const body = {
    id: "id",
    rawId: "rawId",
    response: {},
    type: "type"
  };
  it("should return true", () => {
    expect(isRequestBody(body)).to.equal(true);
  });

  it("should return false", () => {
    expect(isRequestBody({})).to.equal(false);
  });
});

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
      tokenBinding: ""
    };
    const result = assertionClientDataJSONValidator(
      requestMock,
      clinetDataJSON
    );
    expect(result).to.equal(true);
  });

  it("should return 'Challenges don't match!'", () => {
    const clinetDataJSON = {
      challenge: "dummy",
      origin: "http://localhost:3000",
      type: "webauthn.get",
      tokenBinding: ""
    };
    try {
      assertionClientDataJSONValidator(requestMock, clinetDataJSON);
    } catch (e) {
      expect(e.message).to.equal("Challenges don't match!");
    }
  });

  it("should return 'Origins don't match!'", () => {
    const clinetDataJSON = {
      challenge: "challenge",
      origin: "dummy",
      type: "webauthn.get",
      tokenBinding: ""
    };
    try {
      assertionClientDataJSONValidator(requestMock, clinetDataJSON);
    } catch (e) {
      expect(e.message).to.equal("Origins don't match!");
    }
  });

  it("should return 'Type don't match!'", () => {
    const clinetDataJSON = {
      challenge: "challenge",
      origin: "https://localhost:3000",
      type: "webauthn.create",
      tokenBinding: ""
    };
    try {
      assertionClientDataJSONValidator(requestMock, clinetDataJSON);
    } catch (e) {
      expect(e.message).to.equal("Type don't match!");
    }
  });

  it("should return 'Token Binding don`t support!'", () => {
    const clinetDataJSON = {
      challenge: "challenge",
      origin: "https://localhost:3000",
      type: "webauthn.get",
      tokenBinding: "tokenBinding"
    };
    try {
      assertionClientDataJSONValidator(requestMock, clinetDataJSON);
    } catch (e) {
      expect(e.message).to.equal("Token Binding don`t support!");
    }
  });
});

describe("attestationResultReqValidator()", () => {
  it("should return true", () => {
    const body = {
      id: "id",
      rawId: "rawId",
      response: {},
      type: "public-key"
    };
    expect(attestationResultReqValidator(body)).to.equal(true);
  });

  it("should return 'Response missing one or more of id/rawId/response/type fields'", () => {
    const body = {};
    try {
      attestationResultReqValidator(body);
    } catch (e) {
      expect(e.message).to.equal(
        "Response missing one or more of id/rawId/response/type fields"
      );
    }
  });

  it("should return 'type is not public-key!'", () => {
    const body = {
      id: "id",
      rawId: "rawId",
      response: {},
      type: "type"
    };
    try {
      attestationResultReqValidator(body);
    } catch (e) {
      expect(e.message).to.equal("type is not public-key!");
    }
  });

  it("should return 'Invalid id!'", () => {
    const body = {
      id: "+/=",
      rawId: "rawId",
      response: {},
      type: "public-key"
    };
    try {
      attestationResultReqValidator(body);
    } catch (e) {
      expect(e.message).to.equal("Invalid id!");
    }
  });
});

describe("assertionResultReqValidator()", () => {
  it("should return true", () => {
    const body = {
      id: "id",
      rawId: "rawId",
      response: {
        authenticatorData: "authenticatorData",
        userHandle: "userHandle",
        signature: "signature"
      },
      type: "public-key"
    };
    expect(assertionResultReqValidator(body)).to.equal(true);
  });

  it("should return 'Response missing one or more of id/rawId/response/type fields'", () => {
    const body = {};
    try {
      assertionResultReqValidator(body);
    } catch (e) {
      expect(e.message).to.equal(
        "Response missing one or more of id/rawId/response/type fields"
      );
    }
  });

  it("should return 'type is not public-key!'", () => {
    const body = {
      id: "id",
      rawId: "rawId",
      response: {},
      type: "type"
    };
    try {
      assertionResultReqValidator(body);
    } catch (e) {
      expect(e.message).to.equal("type is not public-key!");
    }
  });

  it("should return 'Invalid id!'", () => {
    const body = {
      id: "+/=",
      rawId: "rawId",
      response: {},
      type: "public-key"
    };
    try {
      assertionResultReqValidator(body);
    } catch (e) {
      expect(e.message).to.equal("Invalid id!");
    }
  });

  it("should return 'AuthenticatorData is missing'", () => {
    const body = {
      id: "id",
      rawId: "rawId",
      response: {},
      type: "public-key"
    };
    try {
      assertionResultReqValidator(body);
    } catch (e) {
      expect(e.message).to.equal("AuthenticatorData is missing");
    }
  });

  it("should return 'AuthenticatorData is not base64url encoded'", () => {
    const body = {
      id: "id",
      rawId: "rawId",
      response: {
        authenticatorData: "+/="
      },
      type: "public-key"
    };
    try {
      assertionResultReqValidator(body);
    } catch (e) {
      expect(e.message).to.equal("AuthenticatorData is not base64url encoded");
    }
  });

  it("should return 'userHandle is not of type DOMString'", () => {
    const body = {
      id: "id",
      rawId: "rawId",
      response: {
        authenticatorData: "authenticatorData",
        userHandle: 100
      },
      type: "public-key"
    };
    try {
      assertionResultReqValidator(body);
    } catch (e) {
      expect(e.message).to.equal("userHandle is not of type DOMString");
    }
  });

  it("should return 'Signature is not base64url encoded'", () => {
    const body = {
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
      assertionResultReqValidator(body);
    } catch (e) {
      expect(e.message).to.equal("Signature is not base64url encoded");
    }
  });
});
