# fido2-middleware
[![Build Status](https://travis-ci.com/kg0r0/fido2-middleware.svg?token=qYr2zD9yqpiRzB1bAgCq&branch=master)](https://travis-ci.com/kg0r0/fido2-middleware) [![Coverage Status](https://coveralls.io/repos/github/kg0r0/fido2-middleware/badge.svg?branch=master)](https://coveralls.io/github/kg0r0/fido2-middleware?branch=master) [![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors) [![npm version](https://badge.fury.io/js/fido2-middleware.svg)](https://badge.fury.io/js/fido2-middleware) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Install
```
$ npm i fido2-middleware
```

## Usage 
```js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const fido2middleware = require('fido2-middleware');
const crypto = require('crypto');
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cookieSession({
  name: 'session',
  keys: [crypto.randomBytes(32).toString('hex')],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(fido2middleware.webAuthentication);


```

## Configuration 
Fido2-middleware reads configuration files in the ``./config`` directory for the running process, typically the application root. 
Place the following files in the config directory:
```
{
    "fido2-middlewareConfig": {
        "fido2lib": {
            "timeout": 60000,
            "rpId": "localhost",
            "challengeSize": 32
        },
        "origin": "https://localhost:3000",
        "factor": "either"
    }
}
```

## Example
```
$ cd example
$ npm install
$ npm start
```
Access to ``https://localhost:3000/``.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/shiv3"><img src="https://avatars1.githubusercontent.com/u/9666625?v=4" width="100px;" alt="shiv3"/><br /><sub><b>shiv3</b></sub></a><br /><a href="https://github.com/kg0r0/fido2-middleware/commits?author=shiv3" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
