var main = Benchmark.Suite("deePool Performance");

main.add(
	"deePool.create()",
	function p1(){
		pool = deePool.create(makeObj);
	},
	Object.assign(Benchmark.__default_benchmark_options__,{
		setup: function p1Setup(){
			var pool;
		},
		teardown: function p1Teardown(){
			pool = null;
		},
	})
);

main.add(
	"use() + recycle(): small pool",
	function p2(){
		item = pool.use();
		pool.recycle(item);
	},
	Object.assign(Benchmark.__default_benchmark_options__,{
		setup: function p2Setup(){
			var item;
			var pool = deePool.create(makeObj);
			pool.grow(10);
		},
		teardown: function p2Teardown(){
			item = pool = null;
		},
	})
);

main.add(
	"use() + recycle(): medium pool",
	function p3(){
		item = pool.use();
		pool.recycle(item);
	},
	Object.assign(Benchmark.__default_benchmark_options__,{
		setup: function p3Setup(){
			var item;
			var pool = deePool.create(makeObj);
			pool.grow(10000);
		},
		teardown: function p3Teardown(){
			item = pool = null;
		},
	})
);

main.add(
	"use() + recycle(): large pool",
	function p4(){
		item = pool.use();
		pool.recycle(item);
	},
	Object.assign(Benchmark.__default_benchmark_options__,{
		setup: function p4Setup(){
			var item;
			var pool = deePool.create(makeObj);
			pool.grow(1E6);
		},
		teardown: function p4Teardown(){
			item = pool = null;
		},
	})
);

main.add(
	"use(): growing pool",
	function p5(){
		// can't let the pool get too big or else GC gets
		// out of control, so reset the pool
		if (pool.size() > 1E6) {
			pool = deePool.create(makeObj);
			pool.grow(5);
		}
		item = pool.use();
	},
	Object.assign(Benchmark.__default_benchmark_options__,{
		initCount: 5000,
		maxTime: 6,
		setup: function p5Setup(){
			var item;
			var pool = deePool.create(makeObj);
			pool.grow(5);
		},
		teardown: function p5Teardown(){
			item = pool = null;
		},
	})
);

main.add(
	"grow(): small increments",
	function p6(){
		// can't let the pool get too big or else GC gets
		// out of control, so reset the pool
		if (poolSize > 1E6) {
			pool = deePool.create(makeObj);
		}
		poolSize = pool.grow(5);
	},
	Object.assign(Benchmark.__default_benchmark_options__,{
		initCount: 5000,
		maxTime: 6,
		setup: function p6Setup(){
			var pool = deePool.create(makeObj);
			var poolSize = 0;
		},
		teardown: function p6Teardown(){
			pool = null;
		},
	})
);

main.add(
	"grow(): medium increments",
	function p7(){
		// can't let the pool get too big or else GC gets
		// out of control, so reset the pool
		if (poolSize > 1E6) {
			pool = deePool.create(makeObj);
		}
		poolSize = pool.grow(500);
	},
	Object.assign(Benchmark.__default_benchmark_options__,{
		initCount: 150,
		maxTime: 6,
		setup: function p7Setup(){
			var pool = deePool.create(makeObj);
			var poolSize = 0;
		},
		teardown: function p7Teardown(){
			pool = null;
		},
	})
);

main.add(
	"grow(): large increments",
	function p8(){
		// can't let the pool get too big or else GC gets
		// out of control, so reset the pool
		if (poolSize > 1E6) {
			pool = deePool.create(makeObj);
		}
		poolSize = pool.grow(10000);
	},
	Object.assign(Benchmark.__default_benchmark_options__,{
		initCount: 90,
		maxTime: 6,
		setup: function p8Setup(){
			var pool = deePool.create(makeObj);
			var poolSize = 0;
		},
		teardown: function p8Teardown(){
			pool = null;
		},
	})
);


main.add(
	"grow(): exponential (doubling)",
	function p9(){
		// can't let the pool get too big or else GC gets
		// out of control, so reset the pool
		if (poolSize > 1E6) {
			pool = deePool.create(makeObj);
			poolSize = pool.grow(2);
		}
		poolSize = pool.grow();
	},
	Object.assign(Benchmark.__default_benchmark_options__,{
		initCount: 19,
		maxTime: 6,
		setup: function p9Setup(){
			var pool = deePool.create(makeObj);
			var poolSize = pool.grow(2);
		},
		teardown: function p9Teardown(){
			pool = null;
		},
	})
);

main.add(
	"use() + recycle(): interleaved",
	function p10(){
		// can't let the pool get too big or else GC gets
		// out of control, so reset the pool
		if (pool.size() > 1E6) {
			pool = deePool.create(makeObj);
			pool.grow(10000);
		}
		item1 = pool.use();
		item2 = pool.use();
		pool.recycle(item1);
		item1 = pool.use();
		pool.recycle(item2);
	},
	Object.assign(Benchmark.__default_benchmark_options__,{
		initCount: 5000,
		maxTime: 6,
		setup: function p10Setup(){
			var item1, item2;
			var pool = deePool.create(makeObj);
			pool.grow(10000);
		},
		teardown: function p10Teardown(){
			item1 = item2 = pool = null;
		},
	})
);

main.run();
