'use strict';
/**
 * Created by jalal on 30/03/14.
 */

Async.WorkerPool = (function(nbWorker, asyncScript)
{
    var _workers = [];

    if (nbWorker === 0)
    {
        throw {msg : 'Cannot create worker pool with 0 thread'};
    }
    for (var i = 0; i < nbWorker; i++)
    {
        _workers.push(new Async.Worker(asyncScript));
    }

    var getWorker = function()
    {
        var lessWorker = _workers[0];

        _workers.forEach(function(worker)
        {
           if (worker.getNbTask() < lessWorker.getNbTask())
           {
               lessWorker = worker;
           }
        });
        return lessWorker;
    };

    return {
        post : function(task)
        {
            var parameters;
            var worker = getWorker();

            if (arguments.length > 1)
            {
                parameters = Array.prototype.slice.call(arguments, 1, arguments.length);
            }
            return worker.post(task, parameters);
        },
        terminate : function(){
            _workers.forEach(function(worker)
            {
               worker.terminate();
            });
            _workers = [];
        }
    };
});