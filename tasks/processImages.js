var exif = require("exif-parser");
var fs = require("fs");
var path = require("path");

module.exports = function(grunt) {

  grunt.registerTask("process-images", function() {

    grunt.task.requires("state");

    var files = grunt.file.expand("src/assets/*/*.jpg");
    var sizes = {
      large: {},
      small: {}
    };
    files.forEach(function(f) {
      var buffer = fs.readFileSync(f);
      var size = exif.create(buffer).parse().getImageSize();
      var base = path.basename(f);
      if (f.indexOf("small") > -1) {
        sizes.small[base] = size;
      } else {
        sizes.large[base] = size;
      }
    });
    grunt.data.sizes = sizes;
  });

};