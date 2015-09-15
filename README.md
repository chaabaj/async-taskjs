##async-taskjs

async-taskjs is a library to do parralel programming in javascript using web worker.

It provide a worker pool and message communication system 
between main thread and task executed in a worker.

##Installation


```cmd

bower install async-taskjs

```

or download these scripts at these url : 

[async-task.min.js][script-url]
[async-thread.min.js][thread-script-url]

[script-url]:https://raw.githubusercontent.com/chaabaj/async-taskjs/master/dist/async-taskjs.min.js
[thread-script-url]:https://github.com/chaabaj/async-taskjs/blob/master/dist/async-thread.min.js

##Getting Started

To load the library in your application put these line :

```html
<script src="pathtoyourscript/async-taskjs.min.js"></script>

```

##Tutorial

Let's begin with create a worker pool :

``` javascript

// We create a new scope to not pollute the global scope
(function()
{
    var nbOfWorker = 2;
    var workerPool = new Async.WorkerPool(nbOfWorker, 'pathtoyourscript/async-thread.min.js');
    
    workerPool.terminate();
}());

```

As you see we creating a new workerPool with 2 worker.
The second parameter is the script we want to load in worker.
I provide you a script to not write this script with all stuff to do like communication, import, posting task.
The name of this script is async-thread.min.js, you have seen it in Installation part.

Next we want to post a task to the worker pool. Let's do it : 

``` javascript

// We create a new scope to not pollute the global scope
(function()
{
    var nbOfWorker = 2;
    var workerPool = new Async.WorkerPool(nbOfWorker, 'pathtoyourscript/async-thread.min.js');
    
    workerPool.post(false, function()
    {
        return 42;
    }).then(function(result)
    {
        console.log(result);
        workerPool.terminate();
    });
}());

```

As you see we calling post method with two parameter and attaching 
a function to the finish task event(called in main thread).

The first parameters of the method post is a boolean say if your task is a infinite task (like an infinite loop)
The second is the task function. 
This method return a Async.Task that contain a then method to attach to the finish event
that received the result of the task.

Warning : We cannot capture variable in the task because in base web worker doesn't support to pass function directly. To allow this i use toString method of Function object in main thread and in thread i use eval to convert it in function.


Next we want to pass it parameters, let's go : 

``` javascript

// We create a new scope to not pollute the global scope
(function()
{
    var nbOfWorker = 2;
    var workerPool = new Async.WorkerPool(nbOfWorker, 'pathtoyourscript/async-thread.min.js');
    
    workerPool.post(false, function(thread, param)
    {
        return param;
    }, 42).then(function(result)
    {
        console.log(result);
        workerPool.terminate();
    }, 42);
}());

```

As you see in your console it printed 42.

You can add a variable of parameter(The type of parameter must be clonable object, transferrable object or a function) as you see we get the param in the function as 2 parameter because we receive the thread itself in first parameter(an Async.ThreadTask object precisly). We see later what we can do with it.

Now we want to communicate between the async task and the main thread. Let's go :

``` javascript

// We create a new scope to not pollute the global scope
(function()
{
    var nbOfWorker = 2;
    var workerPool = new Async.WorkerPool(nbOfWorker, 'pathtoyourscript/async-thread.min.js');
    var task = new Async.Task(function(thread)
    {
        thread.on('onReceiveData', function(evt, param)
        {
            thread.emit('onResponse', param + 1);
        };
    });
    
    task.on('onResponse', function(evt, param)
    {
        console.log(param);
    });
    
    task.emit('onReceiveData', 42);
    
    workerPool.post(false, task);
}());

```

In your console it printed 43. 

As you see we can communicate between main thread and async-task using message communication of web worker that can create good parralel program without care of synchronization mechanism in other language with threading support.

##Conclusion

That we viewed the basic of the library, we seen how write parralel program with it and how using message communication system. The use of the library must be for the long task that need long time of execution like load a large file, process image, some huge computation, raytracing and many i miss.

