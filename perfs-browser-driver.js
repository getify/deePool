var results = document.getElementById("results");
var perfWorker = new Worker("perfs-browser-worker.js?" + Math.random());

perfWorker.addEventListener("message",function onMessage({ data: evt }){
	benchmarkCallbacks[evt.type](evt);
});

var benchmarkCallbacks = {
	start(evt){
		var div = document.createElement("p");
		div.innerHTML = `${evt.target.name}...`;
		results.appendChild(div);
	},
	complete(evt){
		results.children[results.children.length-1].innerHTML += ` complete: ${evt.target.hz} (${evt.testsCompleted}/${evt.testCount})`;

		// test suite complete?
		if (evt.testsCompleted === evt.testCount) {
			var div = document.createElement("p");
			div.innerHTML = `Done.`;
			results.appendChild(div);
		}
	},
	cycle(evt){},
	error(evt){
		var div = document.createElement("p");
		div.innerHTML = `Error: ${JSON.stringify(evt)}`;
		results.appendChild(div);
	},
	abort(evt){
		var div = document.createElement("p");
		div.innerHTML = `Aborted: ${JSON.stringify(evt)}`;
		results.appendChild(div);
	},
};
