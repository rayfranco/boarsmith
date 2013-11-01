/*
 * Assemble Plugin: Data
 *
 * Copyright (c) 2013 Franco Bouly.
 * Licensed under the MIT license.
 */

// Node.js
var YAML  = require('js-yaml');

var options = {
  stage: 'assemble:post:pages'
};

var plugin = function(params, callback) {

  'use strict';

  var converted = 0;

  var pages = params.assemble.options.pages,
      grunt = params.grunt,
      async = grunt.util.async;

  async.forEach(pages, function(file, next) {

      grunt.log.write('Converting to JSON '+ file.src.cyan);

      try {
        file.page = YAML.load(file.page);
        file.page = JSON.stringify(file.page);

        grunt.log.success(' OK');

        converted += 1;

        next();
      }
      catch (e) {
        grunt.log.error(' FAILED');

        next();
      }
  });

  grunt.log.ok(converted+' pages converted.');

  callback();
};

plugin.options = options;
module.exports = plugin;