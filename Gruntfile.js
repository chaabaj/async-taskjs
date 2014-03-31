"use strict";

module.exports = function (grunt)
{

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        // Define Directory
        dirs: {
            js: "src/js",
            build: "dist"
        },

        // Metadata
        pkg: grunt.file.readJSON("package.json"),
        banner: "\n" +
            "/*\n" +
            " * -------------------------------------------------------\n" +
            " * Project: <%= pkg.title %>\n" +
            " * Version: <%= pkg.version %>\n" +
            " *\n" +
            " * Author:  <%= pkg.author.name %>\n" +
            " * Site:     <%= pkg.author.url %>\n" +
            " * Contact: <%= pkg.author.email %>\n" +
            " *\n" +
            " *\n" +
            " * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>\n" +
            " * -------------------------------------------------------\n" +
            " */\n" +
            "\n",

        // Minify and Concat archives
        uglify: {
            options: {
                mangle: false,
                banner: "<%= banner %>"
            },
            dist: {
                files: {
                    "<%= dirs.build %>/async-taskjs.min.js": [
                        '<%= dirs.js %>/namespace.js',
                        '<%= dirs.js %>/extend.js',
                        '<%= dirs.js %>/events.js',
                        '<%= dirs.js %>/task.js',
                        '<%= dirs.js %>/worker.js',
                        '<%= dirs.js %>/worker-pool.js'
                    ]
                }
            },
            dist_async: {
                files: {
                    "<%= dirs.build %>/async-thread.min.js" : [
                        '<%= dirs.js %>/async-thread.js'
                    ]
                }
            }

        },

        jsdoc : {
            dist : {
                src : ['<%= dirs.js %>/*.js'],
                options : {
                    destination : 'doc'
                }
            }
        },

        // Notifications
        notify: {
            js: {
                options: {
                    title: "Javascript - <%= pkg.title %>",
                    message: "Minified and validated with success!"
                }
            }
        }
    });


    // Register Taks
    // --------------------------

    // Observe changes, concatenate, minify and validate files
    grunt.registerTask("default", [ "uglify", "notify:js" ]);

};