#!/usr/bin/env node

global.deePool = require("../lib/deePool.src.js");
global.QUnit = require("qunitjs");

require("./qunit.config.js");
require("./tests.js");

QUnit.start();
