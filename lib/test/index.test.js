"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index = require('../src/index');
var request = require('supertest');
var express = require('express');
describe('attestationOptions()', function () {
    it('should', function () {
        var app = express();
        app.use('/', index.attestationOptions);
        app.get('/', function (req, res, next) {
        });
    });
});
