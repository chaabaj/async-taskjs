'use strict';
/**
 * Created by jalal on 30/03/14.
 */

/**
 * @class Async.Worker
 * @classdesc Worker class his work is to send task in taskQueue to thread and receive message to the thread
 * It support event msg communication vie emit
 */
Async.Worker = (function (asyncScript)
{
    var self;

    /**
     * @memberof Async.Worker
     * @private
     * @instance
     * @desc the web worker instance
     * @type {Worker}
     */
    var thread = new Worker(asyncScript);
    /**
     * @memberof Async.Worker
     * @private
     * @instance
     * @desc the task queue
     * @type {Array}
     */
    var taskQueue = [];

    /**
     * @method launchNextTask
     * @private
     * @instance
     * @memberof Async.Worker
     * @desc method called when a task is in the task queue
     */
    var launchNextTask = function()
    {
        var msg;
        var taskMsg;
        var task = taskQueue[0];

        taskMsg = {
            eventName : 'postTask',
            code : task.getAction().toString(),
            params : task.parameters
        };
        task.setActiveWorker(self);
        thread.postMessage(taskMsg);
        while ((msg = task.popMessage()) !== null)
        {
            thread.postMessage(msg);
        }
    };

    /**
     * @private
     * @method onTaskDone
     * @instance
     * @memberof Async.Worker
     * @desc method called when a task is done
     * @param msg
     */
    var onTaskDone = function(msg)
    {
        var task;
        var finishCallback;

        if (taskQueue.length > 0)
        {
            task = taskQueue[0];
            taskQueue.splice(0, 1);
            finishCallback = task.getFinishCallback();
            if (finishCallback !== null)
            {
                finishCallback(msg.result);
            }
            else
            {
                task.setResult(msg.result);
            }
            if (taskQueue.length > 0)
            {
                launchNextTask();
            }
        }
    };

    thread.addEventListener('message', function(evt)
    {
        var msg = evt.data;

        if (msg.eventName === 'onTaskDone')
        {
            onTaskDone(msg);
        }
        else if (taskQueue.length > 0)
        {
            taskQueue[0].receiveMsg(msg);
        }
    });

    var self = {
        /**
         * @instance
         * @memberof Async.Worker
         * @desc if the worker is dedicated to a task or not
         * @private
         * @type {boolean}
         */
        isDedicated : false,
        /**
         * @public
         * @instance
         * @method post
         * @memberof Async.Worker
         * @desc method to post a task to the worker
         * @param {Callable} task
         * @param {Array} parameters
         * @returns {Async.Task} return the worker posted
         */
        post: function (task, parameters)
        {
            var newTask;

            if (typeof task === 'function')
            {
                newTask = new Async.Task(task);
            }
            else
            {
                newTask = task;
            }
            newTask.parameters = parameters;
            taskQueue.push(newTask);
            if (taskQueue.length === 1)
            {
                launchNextTask();
            }
            return newTask;
        },
        /**
         * @public
         * @instance
         * @memberof Async.Worker
         * @desc post a msg to the thread
         * @method emit
         * @param {String} msg
         */
        emit : function(msg)
        {
            thread.postMessage(msg);
        },
        /**
         * @public
         * @instance
         * @memberof Async.Worker
         * @method getNbTask
         * @desc get the number of task to do
         * @returns {Number}
         */
        getNbTask: function ()
        {
            return taskQueue.length;
        },
        /**
         * @public
         * @instance
         * @memberof Async.Worker
         * @method terminate
         * @desc terminate the thread
         */
        terminate : function() {
            thread.terminate();
        }
    };
    return self;
});