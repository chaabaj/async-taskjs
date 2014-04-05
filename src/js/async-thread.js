/**
 * Created by jalal on 30/03/14.
 */

var Async = {};

Async.currentTask = null;

/**
 * @class Async.ThreadTask
 * @classdesc manage a task in a worker with event communication system
 */
Async.ThreadTask = function (task)
{
    /**
     * @member _listener
     * @memberof Async.ThreadTask
     * @instance
     * @type {Object}
     * @desc listener
     * @private
     */
    var _listeners = {};
    var _self;

    _self = {
        /**
         * @method emit
         * @public
         * @instance
         * @memberof Async.ThreadTask
         * @param {String} eventName name of event
         * @dest emit a event to the ui thread(main thread)
         */
        emit: function (eventName)
        {
            var msg = {
                eventName: eventName,
                data: Array.prototype.slice.call(arguments, 1, arguments.length)
            };

            postMessage(msg);
        },
        /**
         * @instance
         * @public
         * @memberof Async.ThreadTask
         * @method receiveMsg
         * @param {Object} msg
         * @desc call a callback if msg event name is listen
         */
        receiveMsg: function (msg)
        {
            var event = _listeners[msg.eventName];

            if (typeof event !== 'undefined')
            {
                event.forEach(function (callback)
                {
                    callback.apply(callback, [msg].concat(msg.data));
                });
            }
        },
        /**
         * @instance
         * @public
         * @memberof Async.ThreadTask
         * @param {String} eventName
         * @param {Function} callback
         * @desc listen a event from ui thread(main thread)
         */
        on: function (eventName, callback)
        {
            var event = _listeners[eventName];

            if (typeof event !== 'undefined')
            {
                event.push(callback);
            }
            else
            {
                _listeners[eventName] = [callback];
            }
        },
        /**
         * @memberof Async.ThreadTask
         * @public
         * @instance
         * @desc do the task and notify the main thread the result of task
         */
        execute: function ()
        {
            var msg;
            var result;

            eval('var fn=' + task.code + ';');
            result = fn.apply(fn, [_self].concat(task.params));
            msg = {
                eventName: 'onTaskDone',
                result: result
            };
            postMessage(msg);
        }
    };
    return _self;
};

onmessage = function (evt)
{
    var msg = evt.data;

    if (msg.eventName === 'postTask')
    {
        Async.currentTask  = new Async.ThreadTask(evt.data);
        Async.currentTask.execute();
    }
    else if (msg.eventName === 'importScript')
    {
        importScripts(msg.file);
    }
    else
    {
        if (Async.currentTask !== null)
        {
            Async.currentTask.receiveMsg(evt.data);
        }
    }
};