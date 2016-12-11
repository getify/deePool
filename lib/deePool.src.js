(function UMD(name,context,definition){
	if (typeof define === "function" && define.amd) { define(definition); }
	else if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
	else { context[name] = definition(name,context); }
})("deePool",this,function DEF(name,context){
	"use strict";

	const EMPTY_SLOT = Object.freeze(Object.create(null));
	const NOTHING = EMPTY_SLOT;

	return { create };


	// ******************************

	// create a new pool
	function create(objectFactory = ()=>({})) {
		var objPool = [];
		var nextFreeSlot = null;	// pool location to look for a free object to use
		var nextOpenSlot = null;	// pool location to insert next recycled object

		return {
			use,
			recycle,
			grow,
			size,
		};


		// ******************************

		function use() {
			var objToUse = NOTHING;

			// know where the next free object in the pool is?
			if (nextFreeSlot != null) {
				objToUse = objPool[nextFreeSlot];
				objPool[nextFreeSlot] = EMPTY_SLOT;
			}
			// otherwise, go looking
			else {
				// search starts with position + 1 (so, 0)
				nextFreeSlot = -1;
			}

			// look for the next free obj
			for (
				var count = 0, i = nextFreeSlot + 1;
				(count < objPool.length) && (i < objPool.length);
				i = (i + 1) % objPool.length, count++
			) {
				// found free obj?
				if (objPool[i] !== EMPTY_SLOT) {
					// still need to free an obj?
					if (objToUse === NOTHING) {
						objToUse = objPool[i];
						objPool[i] = EMPTY_SLOT;
					}
					// this slot's obj can be used next time
					else {
						nextFreeSlot = i;
						return objToUse;
					}
				}
			}

			// no other free objs left
			nextFreeSlot = null;

			// still haven't found a free obj to use?
			if (objToUse === NOTHING) {
				// double the pool size (or minimum 5 if empty)
				grow(objPool.length || 5);

				objToUse = objPool[nextFreeSlot];
				objPool[nextFreeSlot] = EMPTY_SLOT;
				nextFreeSlot++;
			}

			return objToUse;
		}

		function recycle(obj) {
			// know where the next empty slot in the pool is?
			if (nextOpenSlot != null) {
				objPool[nextOpenSlot] = obj;
				obj = NOTHING;
			}
			// otherwise, go looking
			else {
				// search starts with position + 1 (so, 0)
				nextOpenSlot = -1;
			}

			// look for the next empty slot
			for (
				var count = 0, i = nextOpenSlot + 1;
				(count < objPool.length) && (i < objPool.length);
				i = (i + 1) % objPool.length, count++
			) {
				// found empty slot?
				if (objPool[i] === EMPTY_SLOT) {
					// obj still needs to be reinserted?
					if (obj !== NOTHING) {
						objPool[i] = obj;
						obj = NOTHING;
					}
					// this empty slot can be used next time!
					else {
						nextOpenSlot = i;
						return;
					}
				}
			}

			// no empty slots left
			nextOpenSlot = null;

			// still haven't recycled obj?
			if (obj !== NOTHING) {
				// insert at the end (growing size of pool by 1)
				// NOTE: this is likely mis-use of the library
				objPool[objPool.length] = obj;
			}
		}

		function grow(count = objPool.length) {
			nextFreeSlot = objPool.length;

			for (var i = 0; i < count; i++) {
				// add new obj to pool
				objPool[objPool.length] = objectFactory();
			}

			// look for an open slot
			nextOpenSlot = null;
			for (var i = 0; i < nextFreeSlot; i++) {
				// found an open slot?
				if (objPool[i] === EMPTY_SLOT) {
					nextOpenSlot = i;
					break;
				}
			}
		}

		function size() {
			return objPool.length;
		}
	}

});
