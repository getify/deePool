var isNode = (typeof process != "undefined" && process.release);

// running in node?
if (isNode) {
	Benchmark.prototype.on("start",function onStart(evt){
		// TODO
	});
	Benchmark.prototype.on("complete",function onComplete(evt){
		// TODO
	});
	Benchmark.prototype.on("cycle",function onCycle(evt){
		// TODO
	});
	Benchmark.prototype.on("error",function onError(evt){
		// TODO
	});
	Benchmark.prototype.on("abort",function onAbort(evt){
		// TODO
	});
}
// otherwise, running in browser
else {
	var results = document.getElementById("results");

	Benchmark.prototype.on("start",function onStart(evt){
		// TODO
	});
	Benchmark.prototype.on("complete",function onComplete(evt){
		// TODO
	});
	Benchmark.prototype.on("cycle",function onCycle(evt){
		// TODO
	});
	Benchmark.prototype.on("error",function onError(evt){
		// TODO
	});
	Benchmark.prototype.on("abort",function onAbort(evt){
		// TODO
	});
}
