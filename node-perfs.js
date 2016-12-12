#!/usr/bin/env node

global.deePool = require("./lib/deePool.src.js");
global.Benchmark = require("benchmark");

require("./benchmark.config.js");
require("./perfs.js");

