/**
 * Created by jalal on 30/03/14.
 */


var Async = {};

Async.currentTask = null;

Async.ThreadTask = function (task)
{
    var _listeners = {};
    var _self = this;

    return {
        addListener: function (eventName, callback)
        {
            var event = _listeners[eventName];

            if (typeof event === 'undefined')
            {
                _listeners[eventName] = [callback];
            }
            else
            {
                _listeners.push(callback);
            }
        },
        receiveMsg: function (msg)
        {
            var event = _listeners[msg.eventName];

            if (typeof event !== 'undefined')
            {
                event.forEach(function(callback)
                {
                    callback(msg);
                });
            }
        },
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
};

onmessage = function (evt)
{
    var msg = evt.data;

    if (msg.eventName === 'postTask')
    {
        Async.currentTask = new Async.ThreadTask(evt.data);
        Async.currentTask.execute();
    }
    else
    {
        if (Async.currentTask !== null)
        {
            Async.currentTask.receiveMsg(evt.data);
        }
    }
};