/**
 * Created by jalal on 30/03/14.
 */

Async.Task = (function (action)
{
    var _onFinished = null;
    var _action = action;
    var _listeners = [];
    var _msgQueue = [];
    var _result = null;

    return {
        on: function (eventName, callback)
        {
            var listener;

            listener = {
              eventName : eventName,
              callback : callback
            };
            _listeners.push(listener);
        },
        emit: function (eventName)
        {
            var msg = {
                name: eventName,
                nbParameters: 0,
                parameters: null
            };

            if (arguments.length > 2)
            {
                msg.parameters = Array.prototype.slice.call(arguments, 1, arguments.length);
                msg.nbParameters = msg.parameters.length;
                _msgQueue.push(msg);
            }
            else
            {
                _msgQueue.push(msg);
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
        getAction : function()
        {
            return _action;
        },
        getFinishCallback: function ()
        {
            return _onFinished;
        },
        getListeners: function ()
        {
            return _listeners;
        },
        popMessage : function()
        {
            var msg = null;

            if (_msgQueue.length > 0)
            {
                msg = _msgQueue[0];
                _msgQueue.splice(0, 1);
            }
            return msg;
        },
        setResult : function(result)
        {
            _result = result;
        }
    };
});