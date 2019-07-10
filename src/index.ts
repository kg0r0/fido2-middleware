import { Request, Response } from "express";
import config from "config";
import { NextFunction } from "connect";
const fido2MiddlewareConfig: Fido2MiddleWareConfig = config.get(
  "fido2-middlewareConfig"
);
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
  cookie: {
    name: string;
    maxAge: number;
    httpOnly: boolean;
  }
}

async function webAuthentication(req: Request, res: Response, next: NextFunction) {
//  if (!req.cookies[fido2MiddlewareConfig.cookie.name]|| false) {
    let errorMessage;
    console.log(req.url)
    switch (req.url) {
      case fido2MiddlewareConfig.attestationOptionsPath || "/attestation/options":
        try {
          await attestationOptions(req, res);
        } catch (e) {
          errorMessage = e.message;
        }
        break;
      case fido2MiddlewareConfig.attestationResultPath || "/attestation/result":
        try {
          await attestationResult(req, res);
        } catch (e) {
          errorMessage = e.message;
        }
        break;
      case fido2MiddlewareConfig.assertionOptionsPath || "/assertion/options":
        try {
          await assertionOptions(req, res);
        } catch (e) {
          errorMessage = e.message;
        }
        break;
      case fido2MiddlewareConfig.assertionResultPath || "/assertion/result":
        try {
          await assertionResult(req, res);
        } catch (e) {
          errorMessage = e.message;
        }
        break;
    }
    if (errorMessage) {
      return res.json({
        status: "failed",
        errorMessage: errorMessage
      })
    }
//  } else {
//    next();
//  }
    next();
}

module.exports = {
  webAuthentication
};
