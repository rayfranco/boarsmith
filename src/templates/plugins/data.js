/*
 * Assemble Plugin: Data
 *
 * Copyright (c) 2013 Franco Bouly.
 * Licensed under the MIT license.
 */

// Node.js
var path  = require('path');

/**
 * @param  {Object}   config
 * @param  {Function} callback
 */
module.exports = function(config, callback) {

  'use strict';

  var options    = config.context;
  var grunt      = config.grunt;
  var files      = options.dataExport;
  var async      = grunt.util.async;

  if (!files || typeof files === 'undefined') { callback(); return; }

  async.forEachSeries(files, function(file, next){

    if (typeof options[file] !== 'object') { next(); return; }

    var outputDir  = path.join(options.dirname,'data',file)

    grunt.verbose.ok('Generating data file for: '. file);
    grunt.file.write(outputDir + '.json', JSON.stringify(options[file], null, 2));

  }, function(err) {
    callback();
  });
};