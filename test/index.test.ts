import { NextFunction } from "connect";

const index = require('../src/index');
const request = require('supertest');
const express = require('express');

describe('attestationOptions()', () => {

  it('should', () => {
    const app = express();
    app.use('/', index.attestationOptions);
    app.get('/', (req: Request, res: Response, next: NextFunction) => {

    })
  })
})
