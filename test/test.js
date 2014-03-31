/**
 * Created by jalal on 30/03/14.
 */

(function ()
{
    var workerPool = new Async.WorkerPool(4);
    var task2;
    var task = new Async.Task(function (thread, param)
    {
        console.log('Im in thread');
        console.info(thread);
        thread.emit("blabla", 6);
        return (param + 2);

    });

    task.then(function (result)
    {
        console.log('haha');
        console.log(result);
    });

    task.on('blabla', function(evt){
        console.log(evt.data);
        console.log("hey salut");

    });

    workerPool.post(task, 42);
    workerPool.post(task, 50);
    task2 = workerPool.post(function(thread, param)
    {
       console.log('lol');
       console.log(param);
       return param + 5000;
    }, 50);

    task2.then(function(result)
    {
        console.log(result);
    });

}());