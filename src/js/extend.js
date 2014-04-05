/**
 * Created by jalal on 31/03/14.
 */

'use strict';
/**
 * @function Async.extend
 * @param {Object] parent the parent object
 * @param {Object} child the child object
 * @desc merge all parent properties in child
 * @returns {Object} the child object merged with the parent
 */
Async.extend = function(parent, child)
{
    for (var key in parent)
    {
        child[key] = parent[key];
    }
    return child;
};