import { Request, Response } from "express";
import { NextFunction } from "connect";
import { attestationOptions, attestationResult } from "./attestation";
import { assertionOptions, assertionResult } from "./assertion";

interface Fido2MiddleWareConfig {
  db: any;
  factor: String;
  fido2lib: {
    timeout: Number;
    rpId: String;
    challengeSize: Number;
  };
  origin: String;
  attestationOptionsPath: String;
  attestationResultPath: String;
  assertionOptionsPath: String;
  assertionResultPath: String;
}

function webAuthentication(options: any) {
  const opts: Fido2MiddleWareConfig = {
    db: {},
    fido2lib: {
      timeout: options.fido2lib.timeout || 60000,
      rpId: options.fido2lib.rpId || "localhost",
      challengeSize: options.fido2lib.challengeSize || 32
    },
    origin: options.origin || "https://localhost:3000",
    factor: options.factor || "either",
    attestationOptionsPath: options.attestationOptionsPath || "/attestation/options",
    attestationResultPath: options.attestationResultPath || "/attestation/result",
    assertionOptionsPath: options.assertionOptionsPath || "/assertion/options",
    assertionResultPath: options.assertionResultPath || "/assertion/result",
  }
  return async function __webAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let options;
    let errorMessage;
    try {
      switch (req.url) {
        case opts.assertionOptionsPath: 
          options = await attestationOptions(req);
          break;
        case opts.attestationResultPath:
          options = await attestationResult(req);
          break;
        case opts.assertionOptionsPath:
          options = await assertionOptions(req);
          break;
        case opts.assertionResultPath:
          options = await assertionResult(req);
          break;
      }
    } catch (e) {
      errorMessage = e.message;
    }
    if (errorMessage) {
      return res.json({
        status: "failed",
        errorMessage: errorMessage
      });
    } else if (options) {
      return res.json(options);
    } else {
      next();
    }
  }
}

module.exports = {
  webAuthentication
};
