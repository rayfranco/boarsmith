/*
 * Assemble Plugin: Data
 *
 * Copyright (c) 2013 Franco Bouly.
 * Licensed under the MIT license.
 */

// Node.js
var path  = require('path');
var YAML  = require('js-yaml'); // Grunt dependency

/**
 * @param  {Object}   config
 * @param  {Function} callback
 */
module.exports = function(config, callback) {

  'use strict';

  var options    = config.context;
  var grunt      = config.grunt;
  var page       = options.page;
  var pages      = options.pages;
  var async      = grunt.util.async;

  async.forEach(pages, function(file, next) {
      if (page.src !== file.src) {
        return;
      }

      file.page = YAML.load(file.page);

      next();
  });

  callback();

  console.log(pages)

  return page;
};