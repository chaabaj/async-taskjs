/**
 * Created by jalal on 31/03/14.
 */

'use strict';
/**
 * @class Async.Events
 * @classdesc Event class to implement an event system communication
 */
Async.Events = function ()
{
    /**
     * @instance
     * @member _listener
     * @memberof Async.Events
     * @type {{Object}}
     * @private
     * @desc listeners
     */
    var _listeners = {};

    return {
        /**
         * @instance
         * @method receiveMsg
         * @public
         * @memberof Async.Events
         * @desc search a listener for a msg
         * @param {Object} msg
         */
        receiveMsg: function (msg)
        {
            var event = _listeners[msg.eventName];

            if (typeof event !== 'undefined')
            {
                event.forEach(function(callback)
                {
                    callback.apply(callback, [msg].concat(msg.data));
                });
            }
        },
        /**
         * @desc unbind an listener
         * @public
         * @instance
         * @method unbind
         * @memberof Async.Events
         * @param {String} eventName
         * @param {Function} callback
         */
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
        /**
         * @instance
         * @public
         * @method unbindAllByName
         * @memberof Async.Events
         * @desc unbind all listener from an event name
         * @param {String} eventName
         */
        unbindAllByName : function(eventName)
        {
            var event = _listeners[eventName];

            if (typeof event !== 'undefined')
            {
                _listeners[eventName] = [];
            }
        },
        /**
         * @instance
         * @public
         * @method on
         * @desc listen an event
         * @memberof Async.Events
         * @param {String} eventName
         * @param {Function} callback
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
        }
    };
};