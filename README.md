angularify
==========

A web application scaffold based on AngularJS and some common libraries like Express and Browserify.

You can see a live example at [angularify.erickruizdechavez.com](http://angularify.erickruizdechavez.com).

How to use it
-------------

This project relies on a Gruntfile with some preconfigured tasks. First thing you want to do is:

```sh
git clone git@github.com:erickrdch/angularify.git
cd angularify
npm install
bower install
```

At this point, you are ready to start working on your local project. To run a local server, just run `grunt` and open your browser at [localhost](http://localhost:3000).

The local project also has these goodies:

- Node server is started using nodemon, therefore, any change to server side JavaScript will autoreload your Node server. No more Ctrl-C, and manual restart.
- All LESS files are being "watched". Any change will recompile them to css and reload the browser if you have a LiveReload plugin.
- All JavaScript files (and the html files in js/src) are being "watched" too, so any change to them will also reload your browser if you have an active LiveReload plugin.

The Gruntfile also includes a "production" task to build minified versions of the JavaScript files by doing `grunt dist`. This one will not run a local server.

If you want to delete all generated files, just run `grunt clean:dist`.

To leave the project clean of all libraries and generated files (delete node_modules, bower_components, css, fonts, etc.) just run `grunt clean`.

TODO
----

- ~~Host a live example of this scaffold.~~
- Improve Gruntfile to avoid repeated paths.
- Create a production version of the LESS files.
- Add comments to JavaScript files.
- Add configuration files (and allow overrides)
