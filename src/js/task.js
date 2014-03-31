'use strict';

/**
 * Created by jalal on 30/03/14.
 */

Async.Task = (function (action)
{
    this.parameters = [];

    var _onFinished = null;
    var _action = action;
    var _msgQueue = [];
    var _result = null;
    var _activeWorker = null;

    return Async.extend(new Async.Events(), {
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
        getAction: function ()
        {
            return _action;
        },
        getFinishCallback: function ()
        {
            return _onFinished;
        },
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
        setResult: function (result)
        {
            _result = result;
        },
        setActiveWorker: function (worker)
        {
            _activeWorker = worker;
        }
    });
});