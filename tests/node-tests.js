#!/usr/bin/env node

global.deePool = require("./lib/deePool.src.js");
global.QUnit = require("qunitjs");

require("./qunit.config.js");
require("./tests.js");

// temporary hack per: https://github.com/qunitjs/qunit/issues/1081
QUnit.load();
