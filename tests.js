function factory(){
	var publicAPI = {
		id: 0,
		make: function make(){
			return {
				id: ++publicAPI.id
			};
		}
	};

	return publicAPI;
}


QUnit.test("deePool.create()",function t1(assert){
	assert.expect(6);

	var inst = factory();
	var pool = deePool.create(inst.make);

	assert.ok(inst.id === 0,"make() not yet called");
	assert.ok(typeof pool == "object","`pool` created");
	assert.ok(typeof pool.use == "function","use()");
	assert.ok(typeof pool.recycle == "function","recycle()");
	assert.ok(typeof pool.grow == "function","grow()");
	assert.ok(typeof pool.size == "function","size()");
});

QUnit.test("use(): basic",function t2(assert){
	assert.expect(14);

	var inst = factory();
	var pool = deePool.create(inst.make);

	var o1 = pool.use();
	var o2 = pool.use();
	var o3 = pool.use();
	var o4 = pool.use();
	var o5 = pool.use();

	assert.ok(inst.id === 5,"make() called five times");
	assert.ok(o1.id === 1,"use() returned o1 with id:1");
	assert.ok(o2.id === 2,"use() returned o2 with id:2");
	assert.ok(o3.id === 3,"use() returned o3 with id:3");
	assert.ok(o4.id === 4,"use() returned o4 with id:4");
	assert.ok(o5.id === 5,"use() returned o5 with id:5");

	var o6 = pool.use();
	var o7 = pool.use();
	var o8 = pool.use();
	var o9 = pool.use();
	var o10 = pool.use();

	assert.ok(inst.id === 10,"make() called five more times");
	assert.ok(o6.id === 6,"use() returned o6 with id:6");
	assert.ok(o7.id === 7,"use() returned o7 with id:7");
	assert.ok(o8.id === 8,"use() returned o8 with id:8");
	assert.ok(o9.id === 9,"use() returned o9 with id:9");
	assert.ok(o10.id === 10,"use() returned o10 with id:10");

	var o11 = pool.use();

	assert.ok(inst.id === 20,"make() called ten more times");
	assert.ok(o11.id === 11,"use() return o11 with id:11");
});

QUnit.test("recycle(): basic",function t3(assert){
	assert.expect(5);

	var inst = factory();
	var pool = deePool.create(inst.make);

	var o1 = pool.use();
	var o2 = pool.use();
	var o3 = pool.use();
	var o4 = pool.use();
	var o5 = pool.use();

	pool.recycle(o1);
	pool.recycle(o2);
	pool.recycle(o3);
	pool.recycle(o4);
	pool.recycle(o5);

	var o6 = pool.use();
	var o7 = pool.use();
	var o8 = pool.use();
	var o9 = pool.use();
	var o10 = pool.use();

	assert.ok(o6 === o1,"use() after recycle(): o6 === o1");
	assert.ok(o7 === o2,"use() after recycle(): o7 === o2");
	assert.ok(o8 === o3,"use() after recycle(): o8 === o3");
	assert.ok(o9 === o4,"use() after recycle(): o9 === o4");
	assert.ok(o10 === o5,"use() after recycle(): o10 === o5");
});

QUnit.test("grow(): basic",function t4(assert){
	assert.expect(10);

	var inst = factory();
	var pool = deePool.create(inst.make);

	pool.grow();
	assert.ok(inst.id === 0,"grow() with no arg has no effect on empty pool");

	pool.grow("nothing");
	assert.ok(inst.id === 0,"grow('nothing') has no effect on pool");

	pool.grow(-3);
	assert.ok(inst.id === 0,"grow(-3) has no effect on pool");

	pool.grow(0);
	assert.ok(inst.id === 0,"grow(0) has no effect on pool");

	pool.grow(3);
	assert.ok(inst.id === 3,"grow(3) called make() three times");

	pool.grow(5);
	assert.ok(inst.id === 8,"grow(5) called make() five more times");

	pool.grow();
	assert.ok(inst.id === 16,"grow() with no arg doubles the current size of the pool");

	pool.grow("nothing");
	assert.ok(inst.id === 16,"grow('nothing') still has no effect on pool");

	pool.grow(-3);
	assert.ok(inst.id === 16,"grow(-3) still has no effect on pool");

	pool.grow(0);
	assert.ok(inst.id === 16,"grow(0) still has no effect on pool");
});

QUnit.test("size(): basic",function t5(assert){
	assert.expect(3);

	var inst = factory();
	var pool = deePool.create(inst.make);

	assert.ok(pool.size() === 0,"size() with empty pool is zero");

	pool.grow(5);
	assert.ok(pool.size() === 5,"size() after grow(5) is five");

	pool.grow();
	assert.ok(pool.size() === 10,"size() after grow() is now ten");
});

QUnit.test("use() + recycle(): complex",function t6(assert){
	assert.expect(12);

	var inst = factory();
	var pool = deePool.create(inst.make);

	pool.grow(4);

	var o1 = pool.use();
	var o2 = pool.use();
	pool.recycle(o1);
	pool.recycle(o2);

	var o3 = pool.use();
	var o4 = pool.use();

	assert.ok(o3.id === 3,"o3 is third element");
	assert.ok(o4.id === 4,"o4 is fourth element");

	pool.recycle(o3);
	var o5 = pool.use();
	var o6 = pool.use();
	var o7 = pool.use();

	assert.ok(o5.id === 1,"o5 is first element");
	assert.ok(o6.id === 2,"o6 is second element");
	assert.ok(o7.id === 3,"o7 is third element");

	// should grow pool
	var o8 = pool.use();
	var o9 = pool.use();

	assert.ok(inst.id === 8,"make() called four more times");
	assert.ok(o8.id === 5,"o8 is fifth element");
	assert.ok(o9.id === 6,"o9 is sixth element");

	pool.recycle(o7);
	pool.recycle(o5);
	var o10 = pool.use();
	var o11 = pool.use();
	var o12 = pool.use();
	var o13 = pool.use();

	assert.ok(o10.id === 7,"o10 is seventh element");
	assert.ok(o11.id === 8,"o11 is eighth element");
	assert.ok(o12.id === 3,"o12 is third element");
	assert.ok(o13.id === 1,"o13 is first element");
});
