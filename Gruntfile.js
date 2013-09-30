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

  // Load all grunt tasks
  grunt.loadNpmTasks('assemble');
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    config: grunt.file.readYAML('src/data/config.yml'),
    // Build HTML from templates and data
    assemble: {
      options: {
        pkg: '<%= pkg %>',
        flatten: true,
        data: 'src/data/*.{json,yml}',
        ext: '.html',
        helpers: ['src/templates/helpers/helper-*.js'],
        partials: ['src/templates/partials/**/*.hbs'],
        layoutdir: 'src/templates/layouts',
        layout: 'default.hbs',
        assets: 'www',
      },
      root: {
        options: {
          layout: 'page.hbs'
        },
        files: {'www/': ['src/content/*.md']}
      },
      fr: {
        options: {
          layout: 'page.hbs'
        },
        files: {'www/fr/': ['src/content/fr/*.md']}
      },
      en: {
        options: {
          layout: 'page.hbs'
        },
        files: {'www/en/': ['src/content/en/*.md']}
      }
    },

    // Remove previously created files
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
          {expand: true, cwd: 'public/', src: ['**'], dest: 'www/'}, // includes files in path
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
        files: ['www/**/*'],
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
          dest: 'www/js',
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
          dest: 'www/css',
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
        engine: 'phantomjs',
        padding: 2
      }
      all2x: {
        src: ['src/sprites@2x/*.png'],
        destImg: 'public/img/spritesheet@2x.png',
        destCSS: 'src/sass/includes/_sprites@2x.scss',
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

    // Deploy to a zip file
    compress: {
      zip: {
        options: {
          archive: "<%= pkg.name %>_<%= grunt.template.today('yyyymmddhhMMss') %>.zip"
        },
        files: [
          {expand: true, cwd: 'www/', src: ['**'], dest: '<%= pkg.name %>/'}
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

  grunt.registerTask('screenshot', function () {
    page.open('http://github.com/', function () {
        page.render('github.png');
        phantom.exit();
    });
  });

  // Default tasks to be run.
  grunt.registerTask('default', 'server');
};
