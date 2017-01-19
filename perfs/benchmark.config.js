var isNode = (typeof process != "undefined" && process.release);
var benchmarkCount = 0;

// running in node?
if (isNode) {
	Benchmark.__default_benchmark_options__ = {
		onStart(evt){
			process.stdout.write(`${evt.target.name}...`);
		},
		onComplete(evt){
			var testsCompleted = ++benchmarkCount;
			process.stdout.write(` complete: ${evt.target.hz} (${testsCompleted}/${global.main.length})\n`);

			// test suite complete?
			if (testsCompleted === global.main.length) {
				process.stdout.write(`Done.\n`);
			}
		},
		onCycle(evt){},
		onError(evt){
			process.stdout.write(`Error:\n${evt.toString()}\n`);
		},
		onAbort(evt){
			process.stdout.write(`Aborted:\n${evt.toString()}\n`);
		},
	};
}
// otherwise, running in browser
else {
	let copyEvent = function copyEvent(evt) {
		return JSON.parse(
			JSON.stringify(evt,
				["type","target","name","count","cycles","hz","times","cycle",
				"elapsed","period","stats","deviation","mean","moe","rme","sem",
				"variance"]
			)
		);
	};

	Benchmark.__default_benchmark_options__ = {
		onStart(evt){
			self.postMessage(copyEvent(evt));
		},
		onComplete(evt){
			evt = copyEvent(evt);
			evt.testsCompleted = ++benchmarkCount;
			evt.testCount = main.length;
			self.postMessage(evt);
		},
		onCycle(evt){
			self.postMessage(copyEvent(evt));
		},
		onError(evt){
			self.postMessage(copyEvent(evt));
		},
		onAbort(evt){
			self.postMessage(copyEvent(evt));
		},
	};
}
