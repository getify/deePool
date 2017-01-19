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

	var objects = new Map();
	var o;

	for (let i = 1; i <= 5; i++) {
		o = pool.use();
		assert.ok(!objects.has(o),`use() is unique #${i}`);
		objects.set(o,i);
	}

	assert.ok(inst.id === 5,"make() was called five times");

	for (let i = 6; i <= 10; i++) {
		o = pool.use();
		assert.ok(!objects.has(o),`use() is unique #${i}`);
		objects.set(o,i);
	}

	assert.ok(inst.id === 10,"make() was called five more times");

	o = pool.use();
	assert.ok(!objects.has(o),`use() is unique #11`);

	assert.ok(inst.id === 20,"make() was called ten more times");
});

QUnit.test("recycle(): basic",function t3(assert){
	assert.expect(6);

	var inst = factory();
	var pool = deePool.create(inst.make);

	var objects = new Map();

	for (let i = 1; i <= 5; i++) {
		let o = pool.use();
		objects.set(o,i);
	}

	for (let o of objects.keys()) {
		pool.recycle(o);
	}

	for (let i = 1; i <= 5; i++) {
		let o = pool.use();
		assert.ok(objects.has(o),`use() not unique after recycle(): #${i}`);
		objects.set(o,i);
	}

	assert.ok(inst.id === 5,"make() only called five times");
});

QUnit.test("grow(): basic",function t4(assert){
	assert.expect(13);

	var inst = factory();
	var pool = deePool.create(inst.make);
	var s;

	s = pool.grow();
	assert.ok(s === 0 && inst.id === 0,"grow() with no arg has no effect on empty pool");

	s = pool.grow("nothing");
	assert.ok(s === 0 && inst.id === 0,"grow('nothing') has no effect on pool");

	s = pool.grow(-3);
	assert.ok(s === 0 && inst.id === 0,"grow(-3) has no effect on pool");

	s = pool.grow(0);
	assert.ok(s === 0 && inst.id === 0,"grow(0) has no effect on pool");

	s = pool.grow(3);
	assert.ok(inst.id === 3,"grow(3) called make() three times");
	assert.ok(s === 3,"grow() returned size 3");

	s = pool.grow(5);
	assert.ok(inst.id === 8,"grow(5) called make() five more times");
	assert.ok(s === 8,"grow() returned size 8");

	s = pool.grow();
	assert.ok(inst.id === 16,"grow() with no arg doubles the current size of the pool");
	assert.ok(s === 16,"grow() returned size 16");

	s = pool.grow("nothing");
	assert.ok(s === 16 && inst.id === 16,"grow('nothing') still has no effect on pool");

	s = pool.grow(-3);
	assert.ok(s === 16 && inst.id === 16,"grow(-3) still has no effect on pool");

	s = pool.grow(0);
	assert.ok(s === 16 && inst.id === 16,"grow(0) still has no effect on pool");
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

QUnit.test("use() + recycle(): interleaved",function t6(assert){
	assert.expect(12);

	var inst = factory();
	var pool = deePool.create(inst.make);

	var objects = new Map();
	var o1, o2, o3, o4, o5, o6, o7;

	pool.grow(6);

	for (let i = 1; i <= 6; i++) {
		o1 = pool.use();
		objects.set(o1,1);
	}

	for (let o of objects.keys()) {
		pool.recycle(o);
	}

	o1 = pool.use();
	assert.ok(objects.has(o1),"use() not unique after recycle(): #1");

	o2 = pool.use();
	assert.ok(objects.has(o2),"use() not unique after recycle(): #2");

	pool.recycle(o1);

	o2 = pool.use();
	assert.ok(objects.has(o2),"use() not unique after recycle(): #3");

	o3 = pool.use();
	assert.ok(objects.has(o3),"use() not unique after recycle(): #4");

	o4 = pool.use();
	assert.ok(objects.has(o4),"use() not unique after recycle(): #5");

	pool.recycle(o2);
	pool.recycle(o4);

	o2 = pool.use();
	assert.ok(objects.has(o2),"use() not unique after recycle(): #6");

	o4 = pool.use();
	assert.ok(objects.has(o4),"use() not unique after recycle(): #7");

	o5 = pool.use();
	assert.ok(objects.has(o5),"use() not unique after recycle(): #8");

	o6 = pool.use();
	assert.ok(objects.has(o6),"use() not unique after recycle(): #9");

	pool.recycle(o5);

	o5 = pool.use();
	assert.ok(objects.has(o5),"use() not unique after recycle(): #10");

	// should grow pool (doubling its size)
	o7 = pool.use();
	assert.ok(!objects.has(o7),"use() unique after implicit grow()");

	assert.ok(inst.id === 12,"make() called twelve times total");
});


// ******************************

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
