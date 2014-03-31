'use strict';
/**
 * Created by jalal on 30/03/14.
 */


/**
 * @class Async.WorkerPool
 * @classdesc WorkerPool is a class to manage a pool of worker and dispatch the task to a worker
 */
Async.WorkerPool = (function(nbWorker, asyncScript)
{
    /**
     * @instance
     * @public
     * @memberof Async.WorkerPool
     * @desc worker array is stored the Async.Worker
     * @type {Array}
     * @private
     */
    var _workers = [];

    if (nbWorker === 0)
    {
        throw {msg : 'Cannot create worker pool with 0 thread'};
    }
    for (var i = 0; i < nbWorker; i++)
    {
        _workers.push(new Async.Worker(asyncScript));
    }

    /**
     * @memberof Async.WorkerPool
     * @private
     * @instance
     * @desc get a worker(the least loaded)
     * @method getWorker
     * @returns {Async.Worker}
     */
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
        /**
         * @instance
         * @public
         * @memberof Async.WorkerPool
         * @method post
         * @desc post a task to a worker in the worker pool
         * @param {Callable} task
         * @returns {*|Task|post|post}
         */
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
        /**
         * @instance
         * @public
         * @memberof Async.WorkerPool
         * @method terminate
         * @desc terminate all worker in worker pool
         */
        terminate : function(){
            _workers.forEach(function(worker)
            {
               worker.terminate();
            });
            _workers = [];
        }
    };
});