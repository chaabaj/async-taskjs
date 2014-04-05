'use strict';
/**
 * Created by jalal on 30/03/14.
 */


/**
 * @class Async.WorkerPool
 * @classdesc WorkerPool is a class to manage a pool of worker and dispatch the task to a worker
 */
Async.WorkerPool = (function (nbWorker, asyncScript)
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
        throw {msg: 'Cannot create worker pool with 0 thread'};
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
    var getWorker = function ()
    {
        var lessWorker = _workers[0];

        _workers.forEach(function (worker)
        {
            if (worker.getNbTask() < lessWorker.getNbTask() && worker.isDedicated === false)
            {
                lessWorker = worker;
            }
        });
        if (lessWorker.isDedicated)
        {
            return null;
        }
        return lessWorker;
    };

    /**
     * @instance
     * @private
     * @desc transform all parameter of type Function to string to be passed to worker
     * @method processParameters
     * @memberof Async.WorkerPool
     * @param parameters
     */
    var processParameters = function (parameters)
    {
        return parameters.map(function (param)
        {
            if (typeof param === 'function')
            {
                return {
                    type : 'function',
                    data : param.toString()
                };
            }
            return {
                type: typeof param,
                data: param
            };
        });
    };

    return {
        /**
         * @instance
         * @public
         * @memberof Async.WorkerPool
         * @method importScript
         * @desc import a script for all worker in worker pool
         * @param {String} scriptFile
         */
        importScript: function (scriptFile)
        {
            var msg = {
                eventName: 'importScript',
                file: scriptFile
            };

            _workers.forEach(function (worker)
            {
                worker.emit(msg);
            });
        },
        /**
         * @instance
         * @public
         * @memberof Async.WorkerPool
         * @method post
         * @throw {Object} if all worker are busy by infinite task the method throw an exception
         * @desc post a task to a worker in the worker pool
         * @param {Async.Task|Function} task
         * @returns {Async.Task} the task you have posted
         */
        post: function (isInfinite, task)
        {
            var parameters;
            var worker = getWorker();

            if (worker === null)
            {
                throw {msg: "All worker are dedicated to a infinite task"};
            }
            if (arguments.length > 2)
            {
                parameters = Array.prototype.slice.call(arguments, 2, arguments.length);
                parameters = processParameters(parameters);
            }
            if (isInfinite === true)
            {
                worker.isDedicated = true;
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
        terminate: function ()
        {
            _workers.forEach(function (worker)
            {
                worker.terminate();
            });
            _workers = [];
        }
    };
});