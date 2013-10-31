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

  // Environment settings
  var env;
  env = grunt.option('env') || 'dev';
  if (grunt.option('prod')) { env = 'prod' } // Shortcut --prod

  // Load all grunt tasks
  grunt.loadNpmTasks('assemble');
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    path: path,
    env: env,
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
        assets: '<%= path.build[env] %>',
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
            dest: '<%= path.build[env] %>'
          },
        ],
      },
      data: {
        options: {
          layout: false,
          ext: '.json',
          plugins: ['src/templates/plugins/data.js']
        },
        files: [
          {
            expand: true,
            cwd: 'src/data/',
            src: ['*.yml'],
            dest: '<%= path.build[env] %>data/'
          }
        ]
      }
    },

    // Remove previously created files
    clean: {
      env: ['<%= path.build[env] %>'],
      all: ['<%= path.build.dev %>', '<%= path.build.prod %>']
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
              mountFolder(connect, path.build[env])
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
          {expand: true, cwd: 'public/', src: ['**'], dest: '<%= path.build[env] %>'}, // includes files in path
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
        files: ['src/sass/**/*.{sass,scss}'],
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
        files: ['<%= path.build[env] %>**/*'],
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
          dest: '<%= path.build[env] %>js',
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
          dest: '<%= path.build[env] %>css',
          ext: '.css'
        }]
      }
    },

    useminPrepare: {
      html: '<%= path.build[env] %>**/*.html',
      options: {
        dest: '<%= path.build[env] %>'
      }
    },

    usemin: {
      html: ['<%= path.build[env] %>{,*/}*.html', '!<%= path.build[env] %>vendor{,*/}*.html'], // todo: remove vendor html files
      css: ['<%= path.build[env] %>styles/{,*/}*.css'],
      options: {
        dirs: ['<%= path.build[env] %>']
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.build[env] %>img',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= path.build[env] %>img'
        }]
      }
    },

    cssmin: {

    },

    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.build[env] %>',
          src: ['!vendor/**/*.html','**/*.html'],
          dest: '<%= path.build[env] %>'
        }]
      }
    },

    uglify: { },

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
      compile: ['assemble','coffee', 'sass'],
    },

    // Take a screenshot
    autoshot: {
      all: {
        options: {
          // necessary config
          path: '<%= path.build[env] %>',
          filename: 'screenshot.png',
          type: 'png',
          // optional config, must set either remote or local
          local: {
            path: '<%= path.build[env] %>',
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
          archive: "<%= path.build[env] %><%= pkg.name %>_<%= grunt.template.today('yyyymmddhhMMss') %>.zip"
        },
        files: [
          {expand: true, cwd: '<%= path.build[env] %>', src: ['**'], dest: '<%= pkg.name %>/'}
        ]
      }
    }
  });

  // Register tasks

  grunt.registerTask('build', function () {
    if (env === 'prod') { // Prod build
      return grunt.task.run(['clean:env','copy','concurrent:compile','useminPrepare','imagemin','concat','uglify','usemin']);
    } else { // Dev build
      return grunt.task.run(['clean:env','copy','concurrent:compile']);
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
