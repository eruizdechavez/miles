'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    meta: {
      bower: 'public/bower_components',
      less: 'public/less',
      css: 'public/css',
      fonts: 'public/fonts',
      jsSrc: 'public/js/src',
      jsDist: 'public/js/dist',
      img: 'public/img',
      dist: 'dist'
    },
    browserify: {
      index: {
        files: {
          'public/js/dist/index.js': 'public/js/src/index.js'
        }
      }
    },
    clean: {
      build: ['<%= meta.jsDist %>', '<%= meta.css %>', '<%= meta.fonts %>'],
      dist: ['<%= meta.clean.build %>', '<%= meta.dist %>'],
      all: ['<%= clean.dist %>', 'node_modules', 'bower_components']
    },
    concat: {
      options: {
        separator: ';',
        stripBanners: true
      },
      libs: {
        files: {
          'public/js/dist/libs.js': [
            'public/bower_components/lodash/dist/lodash.js',
            'public/bower_components/angular/angular.js',
            'public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'public/bower_components/angular-ui-router/release/angular-ui-router.js',
            'public/bower_components/restangular/dist/restangular.js',
            'public/bower_components/alertify.js/lib/alertify.js'
          ]
        }
      },
      libsMin: {
        files: {
          'public/js/dist/libs.js': [
            'public/bower_components/lodash/dist/lodash.min.js',
            'public/bower_components/angular/angular.min.js',
            'public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'public/bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'public/bower_components/restangular/dist/restangular.min.js',
            'public/bower_components/alertify.js/lib/alertify.min.js'
          ]
        }
      }
    },
    concurrent: {
      development: {
        tasks: ['development', 'watch', 'nodemon'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    copy: {
      fonts: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: ['public/bower_components/bootstrap/fonts/**'],
        dest: 'public/fonts/'
      },
      dist: {
        expand: true,
        src: ['app.js', 'index.js', '<%= meta.css %>/**/*', '<%= meta.fonts %>/**/*', '<%= meta.img %>/**/*', '<%= meta.jsDist %>/**/*', 'package.json', 'views/**/*'],
        dest: '<%= meta.dist %>/'
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      browser: {
        src: 'public/js/src/**/*.js'
      }
    },
    less: {
      styles: {
        options: {
          paths: [
            'public/bower_components/',
            'public/less'
          ]
        },
        files: {
          'public/css/styles.css': 'public/less/styles.less'
        }
      }
    },
    nodemon: {
      development: {
        script: 'index.js'
      }
    },
    uglify: {
      index: {
        files: {
          'public/js/dist/index.js': 'public/js/dist/index.js'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      less: {
        files: ['public/less/**/*.less'],
        tasks: ['less:styles'],
        options: {
          livereload: true
        }
      },
      javascript: {
        files: ['<%= jshint.browser.src %>', 'public/js/src/**/*.html'],
        tasks: ['jshint:browser', 'browserify:index'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', ['concurrent:development']);

  grunt.registerTask('development', ['clean:build', 'concat:libs', 'browserify', 'less', 'copy:fonts']);
  grunt.registerTask('build', ['clean:build', 'concat:libsMin', 'browserify', 'uglify', 'less', 'copy:fonts']);
  grunt.registerTask('dist', ['build', 'copy:dist']);
};
