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
      dev: {
        build: 'build/dev/'
      },
      preprod: {
        build: 'build/preprod/'
      },
      prod: {
        build: 'build/prod/'
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
    path: path[env],
    env: env,
    pkg: grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    config: grunt.file.readYAML('src/data/config.yml')[env],
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
        assets: '<%= path.build %>',
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
            dest: '<%= path.build %>'
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
            dest: '<%= path.build %>data/'
          }
        ]
      }
    },

    // Remove previously created files
    clean: {
      env: ['<%= path.build %>'],
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
              mountFolder(connect, path[env].build)
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
          {expand: true, cwd: 'public/', src: ['**'], dest: '<%= path.build %>'}, // includes files in path
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
        files: ['<%= path.build %>**/*'],
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
          dest: '<%= path.build %>js',
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
          dest: '<%= path.build %>css',
          ext: '.css'
        }]
      }
    },

    useminPrepare: {
      html: ['<%= path.build %>**/*.html','!<%= path.build %>vendor/**/*.html'],
      options: {
        root: '<%= path.build %>',
        dest: '<%= path.build %>'
      }
    },

    usemin: {
      html: ['<%= path.build %>**/*.html', '!<%= path.build %>vendor/**/*.html'],
      css: ['<%= path.build %>css/**/*.css'],
      options: {
        dirs: ['<%= path.build %>']
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.build %>img',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= path.build %>img'
        }]
      }
    },

    cssmin: {

    },

    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.build %>',
          src: ['!vendor/**/*.html','**/*.html'],
          dest: '<%= path.build %>'
        }]
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - by <%= pkg.author %> ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
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
      compile: ['assemble','coffee', 'sass'],
    },

    // Take a screenshot
    autoshot: {
      all: {
        options: {
          // necessary config
          path: '<%= path.build %>',
          filename: 'screenshot.png',
          type: 'png',
          // optional config, must set either remote or local
          local: {
            path: '<%= path.build %>',
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
          archive: "<%= path.build %><%= pkg.name %>_<%= grunt.template.today('yyyymmddhhMMss') %>.zip"
        },
        files: [
          {expand: true, cwd: '<%= path.build %>', src: ['**'], dest: '<%= pkg.name %>/'}
        ]
      }
    },

    // Replace absolute paths by fully qualified URLs (until usemin can't handle relative dest option)
    "string-replace": {
      dist: {
        files: {
          './': '<%= path.build %>**/*.html'
        },
        options: {
          replacements: [
            {
              pattern: /(src|href)="\//g,
              replacement: "$1=\"<%= config.url %>/"
            }
          ]
        }
      }
    }
  });

  // Register tasks

  grunt.registerTask('build', function () {
    if (env === 'prod' || env === 'preprod') { // Prod/Preprod build
      return grunt.task.run(['clean:env','copy','concurrent:compile','useminPrepare','imagemin','concat','uglify','usemin','string-replace']);
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
