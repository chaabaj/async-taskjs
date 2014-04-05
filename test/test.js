/**
 * Created by jalal on 30/03/14.
 */

(function ()
{
    var workerPool = new Async.WorkerPool(10, 'async-thread.js');
    var task2;
    var task = new Async.Task(function (thread, param)
    {
        thread.emit("blabla", 6);
        thread.on('toto', function (evt, param)
        {
            param + 3;
        });
        return (param + 2);

    });

    task.then(function (result)
    {
        console.log("Result task 1 : " + result);
    });

    task.on('blabla', function (evt, param)
    {
        task.emit('toto', 128);

    });

    // stress test
    for (var i = 0; i < 100; i++)
    {
        workerPool.post(false, task, i);
    }

    task2 = workerPool.post(false, function (thread, param)
    {
        return param + 5000;
    }, 60);

    task2.then(function (result)
    {
        console.log("Result task 2 : " + result);
    });
}());