/**
 * Created by jalal on 31/03/14.
 */

'use strict';

Async.extend = function(parent, child)
{
    for (var key in parent)
    {
        child[key] = parent[key];
    }
    return child;
};