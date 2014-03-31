/**
 * Created by jalal on 30/03/14.
 */

(function ()
{
    var workerPool = new Async.WorkerPool(2);
    var task2;
    var task = new Async.Task(function (thread, param)
    {
        thread.emit("blabla", 6);
        thread.on('toto', function(evt, param)
        {
           console.log("from main thread : " +  evt.data + ':' + param);
        });
        return (param + 2);

    });

    task.then(function (result)
    {
        console.log('haha');
        console.log(result);
    });

    task.on('blabla', function(evt, param){
        console.log(evt.data + ':' + param);
        console.log("hey salut");
        task.emit('toto', 128);

    });

    workerPool.post(task, 42);
    workerPool.post(task, 50);
    task2 = workerPool.post(function(thread, param)
    {
       console.log('trololololololol');
       console.log(param);
       return param + 5000;
    }, 50);

    task2.then(function(result)
    {
        console.log('hey svp');
        console.log(result);
    });
}());