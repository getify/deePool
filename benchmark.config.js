var isNode = (typeof process != "undefined" && process.release);

// running in node?
if (isNode) {
	Benchmark.__default_benchmark_options__ = {
		onStart(evt){
			// TODO
		},
		onComplete(evt){
			// TODO
		},
		onCycle(evt){},
		onError(evt){},
		onAbort(evt){},
	};
}
// otherwise, running in browser
else {
	var results = document.getElementById("results");

	Benchmark.__default_benchmark_options__ = {
		onStart(evt){
			// TODO
		},
		onComplete(evt){
			// TODO
		},
		onCycle(evt){},
		onError(evt){},
		onAbort(evt){},
	};
}
