(function() {
  module.exports.register = function(Handlebars, options) {

    var path  = require("path");
    var grunt = require('grunt');
    var _     = grunt.util._;

    /*
     * Usage: {{ include [partial] }}
     */
    Handlebars.registerHelper("include", function(template, options) {
      var partial = Handlebars.partials[template];
      if (typeof partial === "string") {
        partial = Handlebars.compile(partial);
        Handlebars.partials[template] = partial;
      }

      if (!partial) {
        return new Handlebars.SafeString('Partial **' + template + '** not found.');
      }
      var context = _.extend({}, this, options.hash);
      return new Handlebars.SafeString(partial(context));
    });

    /*
     * Usage: {{ debug [value] }}
     */
    Handlebars.registerHelper("debug", function(optionalValue) {
      console.log("Current Context");
      console.log("====================");
      console.log(this);
     
      if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
      }
    });

  };
}).call(this);