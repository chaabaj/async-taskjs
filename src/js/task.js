'use strict';

/**
 * Created by jalal on 30/03/14.
 */

/**
 * @class Async.Task
 * @classdesc Represent an async task
 */
Async.Task = (function (action)
{
    /**
     * @instance
     * @public
     * @member parameters
     * @desc parameters to bind to the task
     * @memberof Async.Task
     * @type {Array}
     */
    this.parameters = [];

    /**
     * @public
     * @member _onFinished
     * @memberof Async.Task
     * @desc when the task finished it call this function if the task is not finished
     * @instance
     * @type {Function}
     * @private
     */
    var _onFinished = null;
    /**
     * @instance
     * @memberof Async.Task
     * @desc describe the action to call in the thread
     * @member _action
     * @type {Function}
     * @private
     */
    var _action = action;
    /**
     * @instance
     * @member _msgQueue
     * @memberof Async.Task
     * @desc a space to stock message before the task is sended to the thread
     * @type {Array}
     * @private
     */
    var _msgQueue = [];
    /**
     * @instance
     * @member _result
     * @memberof Async.Task
     * @desc the future result is stored in this member
     * @type {Object}
     * @private
     */
    var _result = null;
    /**
     * @instance
     * @member _activeWorker
     * @memberof Async.Task
     * @desc the thread of the worker if the worker is null, that say the task is not launched and waiting in task queue
     * @type {Worker}
     * @private
     */
    var _activeWorker = null;

    return Async.extend(new Async.Events(), {
        /**
         * @public
         * @instance
         * @method emit
         * @memberof Async.Task
         * @desc emit a signal to the thread if the active worker is not null otherwise store the message in msgQueue
         * @param {String} eventName
         */
        emit: function (eventName)
        {
            var msg = {
                eventName: eventName,
                data: null
            };

            msg.data = Array.prototype.slice.call(arguments, 1, arguments.length);
            if (_activeWorker === null)
            {
                if (arguments.length > 2)
                {
                    _msgQueue.push(msg);
                }
                else
                {
                    _msgQueue.push(msg);
                }
            }
            else
            {
                _activeWorker.emit(msg);
            }
        },
        /**
         * @public
         * @instance
         * @method then
         * @memberof Async.Task
         * @desc method to bind a callback to the future result of the task
         * @param {Function} callback
         */
        then: function (callback)
        {
            if (_result !== null)
            {
                callback(result);
            }
            else
            {
                _onFinished = callback;
            }
        },
        /**
         * @instance
         * @public
         * @method getAction
         * @memberof Async.Task
         * @desc get the action
         * @returns {Function}
         */
        getAction: function ()
        {
            return _action;
        },
        /**
         * @instance
         * @public
         * @method getFinishCallback
         * @desc get the finish callback it is the callback called when the task done
         * @memberof Async.Task
         * @returns {Function}
         */
        getFinishCallback: function ()
        {
            return _onFinished;
        },
        /**
         * @instance
         * @public
         * @method popMessage
         * @memberof Async.Task
         * @desc pop a msg from the msgQueue if no msg is in msgQueue the method return null
         * @returns {Object}
         */
        popMessage: function ()
        {
            var msg = null;

            if (_msgQueue.length > 0)
            {
                msg = _msgQueue[0];
                _msgQueue.splice(0, 1);
            }
            return msg;
        },
        /**
         * @instance
         * @public
         * @method setResult
         * @memberof Async.Task
         * @desc set the result of task
         * @param {Object} result
         */
        setResult: function (result)
        {
            _result = result;
        },
        /**
         * @instance
         * @public
         * @method setActiveWorker
         * @memberof Async.Task
         * @desc set the worker of the task
         * @param {Worker} worker
         */
        setActiveWorker: function (worker)
        {
            _activeWorker = worker;
        }
    });
});