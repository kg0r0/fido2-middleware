/// <reference types="node" />
interface RequestBody {
    id: Number;
    rawId: String;
    response: any;
    type: String;
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
export declare function preFormatResultReq(reqBody: RequestBody): RequestBody;
export {};
