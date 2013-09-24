/*
 * Yeyo
 * https://github.com/Franco Bouly/Yeyo
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

'use strict';

var LIVERELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  // load all grunt tasks
  grunt.loadNpmTasks('assemble');
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,

    // Build HTML from templates and data
    assemble: {
      options: {
        pkg: '<%= pkg %>',
        flatten: true,
        ext: '.html',
        assets: 'www',
        helpers: ['src/templates/helpers/helper-*.js'],
        partials: ['src/templates/partials/**/*.hbs'],
        layoutdir: 'src/templates/layouts',
        layout: 'default.hbs',
        data: ['src/templates/data/*.{json,yml}']
      },
      root: {
        options: {
          ext: '.html',
          engine: 'handlebars',
          partials: ['src/templates/partials/**/*.hbs'],
          layout: 'page.hbs'
        },
        files: {'www/': ['src/content/*.md']}
      },
      fr: {
        options: {
          ext: '.html',
          engine: 'handlebars',
          layout: 'page.hbs'
        },
        files: {'www/fr/': ['src/content/fr/*.md']}
      },
      en: {
        options: {
          ext: '.html',
          engine: 'handlebars',
          layout: 'page.hbs'
        },
        files: {'www/en/': ['src/content/en/*.md']}
      }
    },

    // Before generating any new files,
    // remove any previously-created files.
    clean: {
      dest: ['www']
    },

    // Create a Server
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'www')
            ];
          }
        }
      }
    },

    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },

    copy: {
      assets: {
        files: [
          {expand: true, cwd: 'public/', src: ['**'], dest: 'www/'}, // includes files in path
        ]
      }
    },

    watch: {
      options: {

      }
    }

  });

  // Register tasks

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean',
      'copy',
      'assemble',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  // Default tasks to be run.
  grunt.registerTask('default', 'server');
};
