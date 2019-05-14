"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var index = require('../src/index');
var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
mocha_1.describe('attestationOptions()', function () {
    var app = express();
    app.use(bodyParser.json());
    app.use(cookieSession({
        name: 'session',
        keys: [crypto.randomBytes(32).toString('hex')],
        maxAge: 24 * 60 * 60 * 1000
    }));
    app.use(cookieParser());
    app.use('/', index.attestationOptions);
    mocha_1.it('should return ok status', function (done) {
        request(app)
            .post('/')
            .send({ username: 'johndoe@example.com', displayName: 'John Doe' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, '{"rp":{"name":"Anonymous Service"},"user":{"name":"johndoe@example.com","displayName":"John Doe"},"challenge":{},"pubKeyCredParams":[{"type":"public-key","alg":-7},{"type":"public-key","alg":-257}],"timeout":60000,"attestation":"direct","status":"ok","errorMessage":""}', done);
    });
    mocha_1.it('should return failed status', function (done) {
        request(app)
            .post('/')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, '{"status":"failed","errorMessage":"Request missing display name or username field!"}', done);
    });
});
//# sourceMappingURL=index.test.js.map