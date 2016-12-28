# deePool

A highly-efficient simple (no frills) object pool.

## Explanation

**deePool** (aka "deep-pool") is an object pool with efficiency (speed, low memory, little-to-no GC) as its primary design goal.

As such, there are no configuration options to tweak behavior. It does one thing, and one thing well. If you want to re-configure the behavior, modify the code. :)

Also, this library doesn't really try to do much in the way of graceful handling of errors or mistakes, as that stuff just slows it down. You should be careful in how you use *deePool*.

## Environment Support

This library requires ES6+ support. If you need to use it in ES<=5, transpile it with Babel yourself.

## Library API

There's only one method on the API:

```js
deePool.create( objectFactory )
```

* `create(..)`: produces a new pool instance. You can create as many separate pools as you need.

   `objectFactory` must be a function that produces a single new empty object (or array, etc) that you want available in the pool. Examples:

   ```js
   var myArrays = deePool.create( function makeArray(){
       return [
           [ "foo", "bar", "baz" ],
           [ 1, 2, 3 ]
       ];
   } );

   var myWidgets = deePool.create( function makeWidgets(){
       return new SomeCoolWidget(1,2,3);
   } );
   ```

### Pool Instance API

Each pool instance has four simple methods on its API:

```js
pool.use()

pool.recycle( obj )

pool.grow( additionalSize )

pool.size()
```

* `pool.use()`: retrieves an available object instance from the pool. Example:

   ```js
   var arr = myArrays.use();
   ```

   **Note:** If the pool doesn't have any free instances, it will automatically grow (double in size, or set to `5` if currently empty) and then return one of the new instances.

* `pool.recycle(..)`: inserts an object instance back into the pool. Example:

   ```js
   myArrays.recycle( arr );
   ```

   **Tips:**
   - Don't forget to `recycle(..)` object instances after you're done using them. They are not automatically recycled, and your pool will run out of available instances, and thus keep growing unboundedly if you don't recycle.
   - Don't `recycle(..)` an object instance until you're fully done with it. As objects are held by reference in JS, if you hold onto a reference and modify an already recycled object, you will cause difficult to track down bugs in your application! To avoid this pitfall, unset your reference(s) to a pooled object immediately after `recycle(..)`.
   - Don't `recycle(..)` objects that weren't created for the pool and extracted by a previous `use()`.
   - Don't `recycle(..)` an object more than once. This will end up creating multiple references in the pool to the same object, which will cause difficult to track down bugs in your application! To avoid this pitfall, unset your reference(s) to a pooled object immediately after `recycle(..)`.
   - Don't create references between object instances in the pool, or you will cause difficult to track down bugs in your application!
   - If you need to "condition" or "reset" an object instance for its later reuse, do so before passing it into `recycle(..)`. If a pooled object holds references to other objects, and you want that memory freed up, make sure to unset those references.

   **Note:** If you insert an object instance into a pool that has no empty slots (this is always a mistake, but is not disallowed!), the result will be that the pool grows in size by 1.

* `pool.grow(..)`: A number passed will specify how many instances to add to the pool (created by `objectFactory()` as specified in the [`deePool.create(..)` call](#library-api)). If no number is passed, the default is the current size of the pool (effectively doubling it in size). `grow(..)` returns the new size of the pool. Examples:

   ```js
   var myPool = deePool.create(makeArray);

   var arr = myPool.use();  // pool size now `5`

   myPool.grow( 3 );        // pool size now `8`
   myPool.grow();           // pool size now `16`
   ```

   **Tips:**
   - A new pool starts out empty (size: `0`). Always call `grow(..)` with a valid positive (non-zero) number to initialize the pool before using it. Otherwise, the call will have no effect; on an empty pool, this will confusingly leave the pool empty.
   - An appropriate initial size for the pool will depend on the tasks you are performing; essentially, how many objects will you need to use concurrently?

      You should profile for this with your use-case(s) to determine what the most likely maximum pool size is. You'll want a pool size that's big enough so it doesn't have to grow very often, but not so big that it wastes memory.
   - Don't grow the pool manually unless you are really sure you know what you're doing. It's better to set the pool size initially and let it grow automatically (via `use()`) only as it needs to.

* `pool.size()`: Returns the number of overall slots in the pool (both used and unused). Example:

   ```js
   var myPool = deePool.create(makeArray);

   myPool.size();     // 0

   myPool.grow(5);
   myPool.grow(10);
   myPool.grow(5);

   myPool.size();     // 20
   ```

## Builds

The core library file can be built (minified) with an included utility:

```
./build-core.js
```

However, the recommended way to invoke this utility is via npm:

```
npm run-script build-core
```

## Performance Benchmarks

To run the performance benchmarks, you must first [build the core library](#builds).

With `npm`, run:

```
npm run perfs
```

Or, manually:

```
node node-perfs.js
```

You can also run the performance benchmarks in your browser by opening up `perfs.html`.

## Tests

To run the tests, you must first [build the core library](#builds).

With `npm`, run:

```
npm test
```

Or, manually:

```
node node-tests.js
```

You can also run the tests in your browser by opening up `tests.html`.

## License

The code and all the documentation are released under the MIT license.

http://getify.mit-license.org/
