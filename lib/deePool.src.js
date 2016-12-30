/*! deePool
    v1.1.0 (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/

(function UMD(name,context,definition){
	if (typeof define === "function" && define.amd) { define(definition); }
	else if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
	else { context[name] = definition(name,context); }
})("deePool",this,function DEF(name,context){
	"use strict";
	
	return { create };

	// ******************************

	// create a new pool
	function create(objectFactory = ()=>({})) {
		var freePool = [];
		var freePoolEnd = -1;
		
		return {
			use,
			recycle,
			grow,
			size,
		};

		// ******************************

		function use() {
			if (freePoolEnd == -1) {
				if (freePool.length == 0) {
					grow(5);
				} else {
					grow();
				}
			}
			return freePool[freePool.length - 1 - (freePoolEnd--)];
		}

		function recycle(obj) {
			freePool[freePool.length - (++freePoolEnd)] = obj;
		}

		function grow(count = freePool.length) {
			for (var i = 0; i < count; ++i) {
				freePool[freePool.length] = objectFactory();
			}
			freePoolEnd += count;
			return freePool.length;
		}

		function size() {
			return freePool.length;
		}
	}

});
