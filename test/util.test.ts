import { describe, it } from "mocha";
import { expect } from "chai";
import base64url from "base64url";
import { isBase64UrlEncoded, randomBase64URLBuffer } from "../src/util";

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
  it("should return ok status", () =>
    expect(isBase64UrlEncoded(base64string)).to.equal(true));
});
