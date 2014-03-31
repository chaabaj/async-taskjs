/**
 * Created by jalal on 31/03/14.
 */

'use strict';

Async.Events = function ()
{
    var _listeners = {};

    return {
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
        unbind : function(eventName, callback)
        {
            var index;
            var event = _listeners[eventName];

            if (typeof event !== 'undefined')
            {
                if ((index = event.indexOf(callback)) !== -1)
                {
                    event.splice(index, 1);
                }
            }
        },
        unbindAllByName : function(eventName)
        {
            var event = _listeners[eventName];

            if (typeof event !== 'undefined')
            {
                _listeners[eventName] = [];
            }
        },
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
        }
    };
};