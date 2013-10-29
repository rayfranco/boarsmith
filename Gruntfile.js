/*
 * Yeyo
 * https://github.com/Franco Bouly/Yeyo
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

'use strict';

var LIVERELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT }),
    path = {
      build: {
        dev: 'build/dev/',
        prod: 'build/prod/'
      }
    };

var mountFolder = function (connect, dir) {
  console.log('MOUNTING: ', dir);
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  // Load all grunt tasks
  grunt.loadNpmTasks('assemble');
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    path: path,
    pkg: grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    config: grunt.file.readYAML('src/data/config.yml'),
    // Build HTML from templates and data
    assemble: {
      options: {
        pkg: '<%= pkg %>',
        flatten: true,
        data: ['src/data/*.{json,yml}'],
        dataExport: ['routing'], // Data to be exported to a json file
        ext: '.html',
        engine: 'handlebars',
        helpers: ['src/templates/helpers/helper-*.js'],
        partials: ['src/templates/partials/**/*.hbs'],
        layoutdir: 'src/templates/layouts',
        layout: 'default.hbs',
        assets: '<%= path.build.dev %>',
        plugins: ['src/templates/plugins/data.js']
      },
      root: {
        options: {
          layout: 'page.hbs'
        },
        files: [
          {
            expand: true,
            cwd: 'src/content/',
            src: ['**/*.md','**/*.hbs'],
            dest: '<%= path.build.dev %>/'
          },
        ],
      },
    },

    // Remove previously created files
    clean: {
      dev: ['<%= path.build.dev %>'],
      prod: ['<%= path.build.prod %>']
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
              mountFolder(connect, path.build.dev)
            ];
          }
        }
      }
    },

    // Open server in browser
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },

    // Copy public folder to dest
    copy: {
      assets: {
        files: [
          {expand: true, cwd: 'public/', src: ['**'], dest: '<%= path.build.dev %>'}, // includes files in path
        ]
      }
    },

    // Watch for changes
    watch: {
      coffee: {
        files: 'src/coffee/**/*.coffee',
        tasks: ['coffee']
      },
      sass: {
        files: ['src/sass/*.{sass,scss}'],
        tasks: ['sass']
      },
      assemble: {
        files: ['src/content/**/*','src/templates/**/*','src/data/**/*'],
        tasks: ['assemble']
      },
      assets: {
        files: ['public/**/*'],
        tasks: ['copy']
      },
      livereload: {
        files: ['<%= path.build.dev %>**/*'],
        options: {
          livereload: true
        }
      }
    },

    // Compile Coffeescript files
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/coffee',
          src: '{,*/}*.coffee',
          dest: '<%= path.build.dev %>/js',
          ext: '.js'
        }]
      }
    },

    // Compile SASS/SCSS files
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/sass',
          src: ['*.{scss,sass}'],
          dest: '<%= path.build.dev %>/css',
          ext: '.css'
        }]
      }
    },

    // Create spritesheets from sprites
    sprite:{
      all: {
        src: ['src/sprites/*.png'],
        destImg: 'public/img/spritesheet.png',
        destCSS: 'src/sass/includes/_sprites.scss',
        imgPath: '../img/spritesheet.png',
        engine: 'phantomjs',
        padding: 2
      }
    },

    // Allow async task running
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      compile: ['assemble','coffee', 'sass']
    },

    // Take a screenshot
    autoshot: {
      all: {
        options: {
          // necessary config
          path: '<%= path.build.dev %>/',
          filename: 'screenshot.png',
          type: 'png',
          // optional config, must set either remote or local
          local: {
            path: '<%= path.build.dev %>/',
            port: 8080,
          },
          viewport: ['1024x768','640x1136','768x1024'] // Desktop, iPhone, iPad
        },
      },
    },

    // Deploy to a zip file
    compress: {
      zip: {
        options: {
          archive: "<%= path.build.dev %>/<%= pkg.name %>_<%= grunt.template.today('yyyymmddhhMMss') %>.zip"
        },
        files: [
          {expand: true, cwd: '<%= path.build.dev %>/', src: ['**'], dest: '<%= pkg.name %>/'}
        ]
      }
    }
  });

  // Register tasks

  grunt.registerTask('build', function (target) {
    if (target === 'dev') {
      // Dev build
    } else { // Prod build
      return grunt.task.run(['clean','copy','concurrent:compile']);
      // return grunt.task.run(['clean','copy','concurrent:compile','autoshot']);
    }
  });

  grunt.registerTask('deploy', function (target) {
    if (target === 'ssh') {

    } else if (target === 'rsync') {

    } else { // Zip
      return grunt.task.run(['build','compress']);
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'build',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  // Default tasks to be run.
  grunt.registerTask('default', 'server');
};
