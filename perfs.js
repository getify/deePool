var main = Benchmark.Suite("deePool Performance");

main.add(
	"deePool.create()",
	function p1(){
		pool = deePool.create(make);
	},
	{
		setup: function p1Setup(){
			var pool;
		},
		teardown: function p1Teardown(){
			pool = null;
		},
	}
);

main.add(
	"use() + recycle(): small pool",
	function p2(){
		item = pool.use();
		pool.recycle(item);
	},
	{
		setup: function p2Setup(){
			var item;
			var pool = deePool.create(make);
			pool.grow(10);
		},
		teardown: function p2Teardown(){
			item = pool = null;
		},
	}
);

main.add(
	"use() + recycle(): medium pool",
	function p3(){
		item = pool.use();
		pool.recycle(item);
	},
	{
		setup: function p3Setup(){
			var item;
			var pool = deePool.create(make);
			pool.grow(10000);
		},
		teardown: function p3Teardown(){
			item = pool = null;
		},
	}
);

main.add(
	"use() + recycle(): large pool",
	function p4(){
		item = pool.use();
		pool.recycle(item);
	},
	{
		setup: function p4Setup(){
			var item;
			var pool = deePool.create(make);
			pool.grow(1000000);
		},
		teardown: function p4Teardown(){
			item = pool = null;
		},
	}
);

main.add(
	"use(): growing pool",
	function p5(){
		item = pool.use();
	},
	{
		setup: function p5Setup(){
			var item;
			var pool = deePool.create(make);
			pool.grow(5);
		},
		teardown: function p5Teardown(){
			item = pool = null;
		},
	}
);

main.add(
	"grow(): small increments",
	function p6(){
		pool.grow(5);
	},
	{
		setup: function p6Setup(){
			var pool = deePool.create(make);
		},
		teardown: function p6Teardown(){
			pool = null;
		},
	}
);

main.add(
	"grow(): medium increments",
	function p7(){
		pool.grow(500);
	},
	{
		setup: function p7Setup(){
			var pool = deePool.create(make);
		},
		teardown: function p7Teardown(){
			pool = null;
		},
	}
);

main.add(
	"grow(): large increments",
	function p8(){
		pool.grow(10000);
	},
	{
		setup: function p8Setup(){
			var pool = deePool.create(make);
		},
		teardown: function p8Teardown(){
			pool = null;
		},
	}
);


main.add(
	"grow(): exponential (doubling)",
	function p9(){
		pool.grow();
	},
	{
		setup: function p9Setup(){
			var pool = deePool.create(make);
			pool.grow(2);
		},
		teardown: function p9Teardown(){
			pool = null;
		},
	}
);

main.add(
	"use() + recycle(): interleaved",
	function p10(){
		item1 = pool.use();
		item2 = pool.use();
		pool.recycle(item1);
		item1 = pool.use();
		pool.recycle(item2);
	},
	{
		setup: function p10Setup(){
			var item1, item2;
			var pool = deePool.create(make);
			pool.grow(10000);
		},
		teardown: function p10Teardown(){
			item1 = item2 = pool = null;
		},
	}
);

main.run();

// *****************

function make() {
	return new MyObject();
}

function MyObject() {
	this.foo = [1,2,3];
}
