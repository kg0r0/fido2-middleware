/// <reference types="node" />
import { Request } from "express";
export interface Fido2MiddleWareConfig {
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
interface RequestBody {
    id: String;
    rawId: String;
    response: any;
    type: String;
}
interface preFormatRequestBody {
    id: ArrayBuffer;
    rawId: ArrayBuffer;
    response: any;
    type: String;
}
export interface ClientDataJSON {
    challenge: String;
    origin: String;
    type: String;
    tokenBinding: String;
}
export interface AuthrInfo {
    fmt: String;
    publicKey: String;
    counter: Number;
    credID: String;
}
/**
 *
 * @param {Number} len
 * @returns {String}
 */
export declare function randomBase64URLBuffer(len: number): string;
/**
 * Takes string and tries to verify base64 url encoded.
 * @param  {String} str
 * @return {Boolean}
 */
export declare function isBase64UrlEncoded(str: String): boolean;
/**
 *
 * @param {Buffer} buf
 * @returns {ArrayBuffer}
 */
export declare function toArrayBuffer(buf: Buffer): ArrayBuffer;
/**
 * Takes object and tires to verify request body.
 * @param {Object} bodyObject
 * @returns {Boolean}
 */
export declare function isRequestBody(bodyObject: any): boolean;
/**
 *
 * @param {RequestBody} reqBody
 * @returns {RequestBody}
 */
export declare function preFormatAttestationResultReq(reqBody: RequestBody): {
    id: any;
    rawId: any;
    response: any;
    type: String;
};
/**
 *
 * @param {RequestBody} reqBody
 * @returns {RequestBody}
 */
export declare function preFormatAssertionResultReq(reqBody: RequestBody): preFormatRequestBody;
/**
 *
 * @param req
 * @param clientDataJSON
 * @param {}
 */
export declare function assertionClientDataJSONValidator(req: Request, clientDataJSON: ClientDataJSON): boolean;
export declare function attestationResultReqValidator(body: any): boolean;
/**
 *
 * @param body
 * @returns {boolean}
 */
export declare function assertionResultReqValidator(body: any): boolean;
export {};
