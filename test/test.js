/**
 * Created by jalal on 30/03/14.
 */

(function ()
{
    var workerPool = new Async.WorkerPool(10);
    var task2;
    var task = new Async.Task(function (thread, param)
    {
        console.log('Running task 1');
        console.log('param is : ' + param);
        thread.emit("blabla", 6);
        thread.on('toto', function (evt, param)
        {
            console.log("from main thread : " + evt.data + ':' + param);
        });
        return (param + 2);

    });

    task.then(function (result)
    {
        console.log("Result task 1 : " + result);
    });

    task.on('blabla', function (evt, param)
    {
        console.log(evt.data + ':' + param);
        console.log("hey salut");
        task.emit('toto', 128);

    });

    // stress test
    for (var i = 0; i < 100; i++)
    {
        workerPool.post(task, i);
    }

    task2 = workerPool.post(function (thread, param)
    {
        console.log('Running task 2');
        return param + 5000;
    }, 60);

    task2.then(function (result)
    {
        console.log("Result task 2 : " + result);
    });
}());