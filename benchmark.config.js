var isNode = (typeof process != "undefined" && process.release);

// running in node?
if (isNode) {
	Benchmark.options.onStart = function onStart(evt){
		// TODO
	};
	Benchmark.options.onComplete = function onComplete(evt){
		// TODO
	};
	Benchmark.options.onCycle = function(evt){};
	Benchmark.options.onError = function(evt){};
	Benchmark.options.onAbort = function(evt){};
}
// otherwise, running in browser
else {
	var results = document.getElementById("results");

	Benchmark.options.onStart = function onStart(evt){
		// TODO
	};
	Benchmark.options.onComplete = function onComplete(evt){
		// TODO
	};
	Benchmark.options.onCycle = function(evt){};
	Benchmark.options.onError = function(evt){};
	Benchmark.options.onAbort = function(evt){};
}
