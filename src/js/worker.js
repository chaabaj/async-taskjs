/**
 * Created by jalal on 30/03/14.
 */

Async.Worker = (function ()
{
    var self = this;
    var thread = new Worker('async-thread.js');
    var taskQueue = [];

    var launchNextTask = function()
    {
        var msg;
        var task = taskQueue[0];

        task.getListeners().forEach(function(listener)
        {
           thread.addEventListener(listener.eventName, listener.callback);
        });
        thread.postMessage(task.getAction().toString());
        while ((msg = task.popMessage()) !== null)
        {
            thread.postMessage(msg);
        }
    };

    thread.addEventListener('onTaskDone', function(result)
    {
        var task;
        var finishCallback;

        if (taskQueue.length > 0)
        {
            task = taskQueue[0];
            taskQueue.splice(0, 1);
            task.getListeners().forEach(function(listener)
            {
                thread.removeEventListener(listener.eventName, listener.callback);
            });
            finishCallback = task.getFinishCallback();
            if (finishCallback !== null)
            {
                finishCallback(result);
            }
            else
            {
                task.setResult(result);
            }
            if (taskQueue.length > 0)
            {
                launchNextTask();
            }
        }
        else
        {
            throw { msg : 'No task for onTaskDone '};
        }
    });

    return {
        post: function (task)
        {
            var newTask;

            if (typeof task === 'function')
            {
                newTask = new Async.Task(task);
            }
            else
            {
                newTask = task;
            }
            taskQueue.push(newTask);
            if (taskQueue.length > 0)
            {
                launchNextTask();
            }
            return newTask;
        },
        getNbTask: function ()
        {
            return taskQueue.length;
        }

    };
});