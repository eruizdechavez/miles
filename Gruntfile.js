'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    meta: {
      bower: 'public/bower_components',
      less: 'public/less',
      css: 'public/css',
      fonts: 'public/fonts',
      jsSrc: 'public/js/src',
      jsDist: 'public/js/dist'
    },
    browserify: {
      index: {
        files: {
          '<%= meta.jsDist %>/index.js': '<%= meta.jsSrc %>/index.js'
        }
      }
    },
    clean: {
      dist: ['<%= meta.jsDist %>', '<%= meta.css %>', '<%= meta.fonts %>'],
      all: ['<%= clean.dist %>', 'node_modules', '<%= meta.bower %>']
    },
    concat: {
      options: {
        separator: ';',
        stripBanners: true
      },
      libs: {
        files: {
          '<%= meta.jsDist %>/libs.js': [
            '<%= meta.bower %>/lodash/dist/lodash.js',
            '<%= meta.bower %>/angular/angular.js',
            '<%= meta.bower %>/angular-bootstrap/ui-bootstrap-tpls.js',
            '<%= meta.bower %>/angular-ui-router/release/angular-ui-router.js',
            '<%= meta.bower %>/restangular/dist/restangular.js',
            '<%= meta.bower %>/alertify.js/lib/alertify.js'
          ]
        }
      },
      libsMin: {
        files: {
          '<%= meta.jsDist %>/libs.js': [
            '<%= meta.bower %>/lodash/dist/lodash.min.js',
            '<%= meta.bower %>/angular/angular.min.js',
            '<%= meta.bower %>/angular-bootstrap/ui-bootstrap-tpls.min.js',
            '<%= meta.bower %>/angular-ui-router/release/angular-ui-router.min.js',
            '<%= meta.bower %>/restangular/dist/restangular.min.js',
            '<%= meta.bower %>/alertify.js/lib/alertify.min.js'
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
        src: ['<%= meta.bower %>/bootstrap/fonts/**'],
        dest: '<%= meta.fonts %>/'
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
        src: '<%= meta.jsSrc %>/**/*.js'
      }
    },
    less: {
      styles: {
        options: {
          paths: [
            '<%= meta.bower %>',
            '<%= meta.less %>'
          ]
        },
        files: {
          '<%= meta.css %>/styles.css': '<%= meta.less %>/styles.less'
        }
      }
    },
    nodemon: {
      dev: {
        script: 'index.js'
      }
    },
    uglify: {
      index: {
        files: {
          '<%= meta.jsDist %>/index.js': '<%= meta.jsDist %>/index.js'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      less: {
        files: ['<%= meta.less %>/**/*.less'],
        tasks: ['less:styles'],
        options: {
          livereload: true
        }
      },
      javascript: {
        files: ['<%= jshint.browser.src %>', '<%= meta.jsSrc %>/**/*.html'],
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

  grunt.registerTask('development', ['clean:dist', 'concat:libs', 'browserify', 'less', 'copy:fonts']);
  grunt.registerTask('dist', ['clean:dist', 'concat:libsMin', 'browserify', 'uglify', 'less', 'copy:fonts']);
};
