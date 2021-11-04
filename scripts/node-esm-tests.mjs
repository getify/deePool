#!/usr/bin/env node

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import deePool from "../dist/esm/deePool.mjs";
global.deePool = deePool;

global.QUnit = require("qunit");

require("../tests/qunit.config.js");
require("../tests/tests.js");

QUnit.start();
