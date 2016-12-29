var isNode = (typeof process != "undefined" && process.release);

// running in node?
if (isNode) {
	Benchmark.__default_benchmark_options__ = {
		onStart(evt){
			process.stdout.write(`${evt.target.name}...`);
		},
		onComplete(evt){
			process.stdout.write(` complete: ${evt.target.hz}\n`);
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
			var div = document.createElement("p");
			div.innerHTML = `${evt.target.name}...`;
			results.appendChild(div);
		},
		onComplete(evt){
			var div = document.createElement("p");
			div.innerHTML = `...complete: ${evt.target.hz}`;
			results.appendChild(div);
		},
		onCycle(evt){},
		onError(evt){},
		onAbort(evt){},
	};
}
