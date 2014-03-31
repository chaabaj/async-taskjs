async-taskjs
============


The purpose of the library is to offer a tools for concurrent programming in JavaScript using web worker.

Before launch a example copy the async-thread.js script into the directory it used by worker.
First step with the library : 


    var workerPool = new Async.WorkerPool(4); // It create a pool of worker with 4 web worker 
    var task = workerPool.post(function() // post a task to the less used worker
    {
        console.log('I\'m in a thread'); // This code is executed in a worker
        return 42;
    });

    task.then(function(result)
    {
        console.log(result) // print 42
    });

It allow communication between the main thread and the thread executing the task. For it use a Async.Task instance
Example : 

    var workerPool = new Async.WorkerPool(4); // It create a pool of worker with 4 web worker 
    var task = new Async.Task(function(thread)
    {
         thread.emit('someSignal', 50);   // emit a signal with thread instance
    });

    task.on('someSignal', function(evt)
    {
         console.log(evt.data); //print 50
    });

    workerPool.post(task);

    promise.then(function(result)
    {
        console.log(result) // print 42
    });

It only work for theses way main thread => thread and thread => main thread
