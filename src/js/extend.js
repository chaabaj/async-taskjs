/**
 * Created by jalal on 31/03/14.
 */

'use strict';
/**
 * @function Async.extend
 * @param {Object] parent
 * @param {Object} child
 * @desc merge all child properties in parent
 * @returns {Object}
 */
Async.extend = function(parent, child)
{
    for (var key in parent)
    {
        child[key] = parent[key];
    }
    return child;
};