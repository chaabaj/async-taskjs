describe("async-task", function ()
{
    var asyncScript = 'src/js/async-thread.js';

    it("Create task", function ()
    {
        expect(new Async.Task(function ()
        {
        })).not.toBe('undefined');

    });

    it("add finish action", function ()
    {
        var task = new Async.Task(function ()
        {
        });

        task.then(function (result)
        {

        });

        expect(task.getAction()).not.toBe(null);
        expect(task.getFinishCallback()).not.toBe(null);
    });

    it('emit message', function ()
    {
        var task = new Async.Task(function ()
        {

        });

        task.emit('some data');
        expect(task.popMessage()).not.toBe(null);
    });

    it('create worker pool of 8 worker', function ()
    {
        var workerPool = new Async.WorkerPool(8, asyncScript)

        workerPool.terminate();

    });

    it('post a task on a worker pool', function ()
    {
        var task;
        var workerPool = new Async.WorkerPool(8, asyncScript);

        task = workerPool.post(false, function ()
        {
            return 42;
        });
        task.then(function (result)
        {
            expect(result).toBe(42);
            workerPool.terminate();
        });
    });

    it('post a task and emit signal from thread to ui thread', function ()
    {
        var workerPool = new Async.WorkerPool(1, asyncScript);
        var task;

        task = new Async.Task(function (thread)
        {
            thread.emit('trololol', 42);
        });

        task.on('trololol', function (evt, param)
        {
            expect(evt.eventName).toBe('trololol');
            expect(param).toBe(42);
        });

        task.then(function ()
        {
            workerPool.terminate();
        });

        workerPool.post(false, task);
    });

    it('post a task and emit data from ui thread to task thread', function ()
    {
        var workerPool = new Async.WorkerPool(1, asyncScript);
        var task;

        task = new Async.Task(function (thread)
        {
            thread.on('trololol', function (evt, param)
            {
                thread.emit('blabla', param);
            });
        });

        task.on('blabla', function (evt, param)
        {
            expect(evt.eventName).toBe('blabla');
            expect(param).toBe(42);
        });

        task.emit('trololol', 42);

        workerPool.post(false, task);

        task.then(function ()
        {
            workerPool.terminate();
        });
    });

    it('small stress test', function ()
    {
        var workerPool = new Async.WorkerPool(8, asyncScript);
        var i = 0;
        var task = new Async.Task(function ()
        {
            return 50;
        });

        task.then(function ()
        {
            i++;
            if (i === 101)
            {
                expect(100).toBe(100);
                workerPool.terminate();
            }
        });

        for (var j = 0; j < 100; ++j)
        {
            workerPool.post(false, task);
        }
    });

    it('test of fake infinite task', function ()
    {
        var workerPool = new Async.WorkerPool(8, asyncScript);
        var task;

        task = workerPool.post(true, function ()
        {
            return 42;
        });

        task.then(function ()
        {
            workerPool.terminate();
        });
    });

    it('busy all worker with infinite task', function ()
    {
        var workerPool = new Async.WorkerPool(1, asyncScript);
        var task = new Async.Task(function ()
        {
            return 42;
        });

        workerPool.post(true, task);
        expect(function ()
        {
            workerPool.post(true, task);
        }).toThrow();
    });

    it('pass function in parameter', function ()
    {
        var workerPool = new Async.WorkerPool(1, asyncScript);

        workerPool.post(false, function(fn)
        {
            return fn();
        }, function()
        {
            return 42;
        }).then(function(result)
        {
            expect(result).toBe(42);
        });
    });
});