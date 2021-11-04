#!/usr/bin/env node

"use strict";

var path = require("path");

/* istanbul ignore next */
if (process.env.TEST_PACKAGE) {
	global.deePool = require("../");
	runTests();
}
/* istanbul ignore next */
else if (process.env.TEST_UMD) {
	global.deePool = require(path.join("..","dist","umd","deePool.js"));
	runTests();
}
/* istanbul ignore next */
else if (process.env.TEST_ESM) {
	let { spawn, } = require("child_process");
	let child = spawn("node",[ path.join(__dirname,"node-esm-tests.mjs"), ]);
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
	child.on("exit",function onExit(code){
		process.exit(code);
	});
}
else {
	global.deePool = require(path.join("..","src","deePool.js"));
	runTests();
}


// ******************************************

function runTests() {
	global.QUnit = require("qunit");

	require(path.join("..","tests","qunit.config.js"));
	require(path.join("..","tests","tests.js"));

	QUnit.start();
}
