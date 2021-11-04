importScripts("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.2/lodash.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.3/platform.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/benchmark/2.1.4/benchmark.js");

importScripts("../dist/umd/deePool.js");

importScripts("benchmark.config.js");
importScripts("perfs.js");

function makeObj() {
	return new MyObject();
}

function MyObject() {
	this.foo = [1,2,3];
}
