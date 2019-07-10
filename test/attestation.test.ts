import { describe, it } from "mocha";
import { attestationOptions } from "../src/attestation"
import { mockReq } from "sinon-express-mock"
import { expect } from "chai";

describe("attestationOptions()", () => {
  it("should return ok status", async () => {
    const request = {
      body: {
        username: "johndoe@example.com",
        displayName: "John Doe"
      },
      session: {
      }

    }
    const requestMock = mockReq(request)
    const options = await attestationOptions(requestMock)
    expect(options.status).to.equal("ok");
  });

  it("should return failed status", async() => {
    const request = {

    };
    const requestMock = mockReq(request);
    const options = await attestationOptions(requestMock);
    expect(options.status).to.equal("failed");
  });
});
