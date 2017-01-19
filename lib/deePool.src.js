/*! deePool
    v2.0.1 (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/

(function UMD(name,context,definition){
	if (typeof define === "function" && define.amd) { define(definition); }
	else if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
	else { context[name] = definition(name,context); }
})("deePool",this,function DEF(name,context){
	"use strict";

	const EMPTY_SLOT = Object.freeze(Object.create(null));

	return { create };


	// ******************************

	// create a new pool
	function create(objectFactory = ()=>({})) {
		var objPool = [];
		var nextFreeSlot = null;	// pool location to look for a free object to use

		return {
			use,
			recycle,
			grow,
			size,
		};


		// ******************************

		function use() {
			if (nextFreeSlot == null || nextFreeSlot == objPool.length) {
				grow( objPool.length || 5 );
			}

			var objToUse = objPool[nextFreeSlot];
			objPool[nextFreeSlot++] = EMPTY_SLOT;
			return objToUse;
		}

		function recycle(obj) {
			if (nextFreeSlot == null || nextFreeSlot == -1) {
				objPool[objPool.length] = obj;
			}
			else {
				objPool[--nextFreeSlot] = obj;
			}
		}

		function grow(count = objPool.length) {
			if (count > 0 && nextFreeSlot == null) {
				nextFreeSlot = 0;
			}

			if (count > 0) {
				var curLen = objPool.length;
				objPool.length += Number(count);

				for (var i = curLen; i < objPool.length; i++) {
					// add new obj to pool
					objPool[i] = objectFactory();
				}
			}

			return objPool.length;
		}

		function size() {
			return objPool.length;
		}
	}

});
