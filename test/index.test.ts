import { NextFunction } from "connect";
import { describe, it } from 'mocha';

const index = require('../src/index');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

describe('attestationOptions()', () => {
  const app = express();

  app.use(bodyParser.json());

  app.use(cookieSession({
    name: 'session',
    keys: [crypto.randomBytes(32).toString('hex')],

    maxAge: 24 * 60 * 60 * 1000
  }))

  app.use(cookieParser());

  app.use('/', index.attestationOptions);


  it('should return ok status', (done) => {
    request(app)
      .post('/')
      .send({ username: 'johndoe@example.com', displayName: 'John Doe' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, '{"rp":{"name":"Anonymous Service"},"user":{"name":"johndoe@example.com","displayName":"John Doe"},"challenge":{},"pubKeyCredParams":[{"type":"public-key","alg":-7},{"type":"public-key","alg":-257}],"timeout":60000,"attestation":"direct","status":"ok","errorMessage":""}', done)
  })

  it('should return failed status', (done) => {
    request(app)
      .post('/')
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, '{"status":"failed","errorMessage":"Request missing display name or username field!"}', done)
  })

})
