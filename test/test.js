/**
 * Created by jalal on 30/03/14.
 */

(function ()
{
    var workerPool = new Async.WorkerPool(1, 'async-thread.js');

    workerPool.importScript('underscore-min.js');
    workerPool.importScript('');
    workerPool.post(false, function()
    {
        return ["Hello",  "World"];
    }).then(function(array)
    {
        workerPool.post(false, function(thread, array)
        {
            return array.join(',');
        }, array).then(function(str)
        {
            console.log(str);
        })
    });
}());