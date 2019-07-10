import { Request, Response } from "express";
import config from "config";
import { NextFunction } from "connect";
import { attestationOptions, attestationResult } from "./attestation";
import { assertionOptions, assertionResult } from "./assertion";
const fido2MiddlewareConfig: Fido2MiddleWareConfig = config.get(
  "fido2-middlewareConfig"
);

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
  cookie: {
    name: string;
    maxAge: number;
    httpOnly: boolean;
  };
}

async function webAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let options;
  let errorMessage;
  try {
    switch (req.url) {
      case fido2MiddlewareConfig.attestationOptionsPath ||
        "/attestation/options":
        options = await attestationOptions(req);
        break;
      case fido2MiddlewareConfig.attestationResultPath || "/attestation/result":
        options = await attestationResult(req);
        break;
      case fido2MiddlewareConfig.assertionOptionsPath || "/assertion/options":
        options = await assertionOptions(req);
        break;
      case fido2MiddlewareConfig.assertionResultPath || "/assertion/result":
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

module.exports = {
  webAuthentication
};
