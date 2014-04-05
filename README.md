##async-taskjs

async-taskjs is a library to do parralel programming in javascript using web worker.

It provide a worker pool and message communication system 
between main thread and task executed in a worker.

##Installation


```cmd

bower install async-taskjs

```

or download these scripts at this url : 

[remote-object][script-url]
[remote-object][thread-script-url]

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
        console.log(42);
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
        return 42;
    }).then(function(result)
    {
        console.log(42);
        workerPool.terminate();
    });
}());

```

